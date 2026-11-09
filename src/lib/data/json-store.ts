import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * Dual Storage Engine:
 * 1. Cloud Key-Value (Upstash Redis / Vercel KV): Used automatically when deployed on
 *    Vercel (or when UPSTASH_REDIS_REST_URL / KV_REST_API_URL is configured).
 *    Provides persistent serverless storage across all regions and instances.
 *
 * 2. Atomic Local JSON Files: Used for local development or persistent servers (VPS/Docker).
 *    Stores data in ./data with atomic rename locks.
 */

export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

const locks = new Map<string, Promise<unknown>>();

function filePath(name: string) {
  return path.join(DATA_DIR, name);
}

let redisInstance: Redis | null | undefined = undefined;

function getRedisClient(): Redis | null {
  if (redisInstance !== undefined) return redisInstance;

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    redisInstance = new Redis({ url, token });
  } else {
    redisInstance = null;
  }
  return redisInstance;
}

function redisKey(name: string) {
  const clean = name.replace(/\.json$/, "");
  return `survey:${clean}`;
}

function parseRedisValue<T>(raw: unknown): T | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }
  return raw as T;
}

async function writeAtomic(target: string, contents: string) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  const tmp = `${target}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, contents, "utf8");
  // Windows can briefly lock files that are being read; retry the rename.
  for (let attempt = 0; ; attempt++) {
    try {
      await fs.rename(tmp, target);
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (attempt < 5 && (code === "EPERM" || code === "EBUSY" || code === "EACCES")) {
        await new Promise((r) => setTimeout(r, 25 * (attempt + 1)));
        continue;
      }
      await fs.rm(tmp, { force: true });
      throw err;
    }
  }
}

function withLock<R>(name: string, fn: () => Promise<R>): Promise<R> {
  const previous = locks.get(name) ?? Promise.resolve();
  const next = previous.then(fn, fn);
  locks.set(
    name,
    next.catch(() => undefined),
  );
  return next;
}

export async function readJson<T>(name: string, initial: () => T): Promise<T> {
  const redis = getRedisClient();
  if (redis) {
    const key = redisKey(name);
    try {
      const raw = await redis.get(key);
      const parsed = parseRedisValue<T>(raw);
      if (parsed !== null) {
        return parsed;
      }

      // If Redis has no data yet, seed it with local bundled data (e.g. seed designs)
      let initialData: T;
      try {
        const localTarget = filePath(name);
        initialData = JSON.parse(await fs.readFile(localTarget, "utf8")) as T;
      } catch {
        initialData = initial();
      }

      await redis.set(key, initialData);
      return initialData;
    } catch (redisErr) {
      console.warn(`[redis] Error reading key ${key}, falling back to local:`, redisErr);
    }
  }

  // Local filesystem read
  const target = filePath(name);
  try {
    return JSON.parse(await fs.readFile(target, "utf8")) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const value = initial();
    // In read-only environments (e.g. Vercel without Redis connected yet),
    // do not throw EROFS when trying to create default file during read.
    try {
      await withLock(name, async () => {
        try {
          await fs.access(target);
        } catch {
          await writeAtomic(target, JSON.stringify(value, null, 2));
        }
      });
    } catch {
      // Ignore write errors during initial read in read-only filesystems
    }
    return value;
  }
}

export async function updateJson<T, R = void>(
  name: string,
  initial: () => T,
  mutator: (data: T) => { data: T; result: R } | Promise<{ data: T; result: R }>,
): Promise<R> {
  const redis = getRedisClient();
  if (redis) {
    const key = redisKey(name);
    let current: T;
    const raw = await redis.get(key);
    const parsed = parseRedisValue<T>(raw);

    if (parsed !== null) {
      current = parsed;
    } else {
      try {
        const localTarget = filePath(name);
        current = JSON.parse(await fs.readFile(localTarget, "utf8")) as T;
      } catch {
        current = initial();
      }
    }

    const { data, result } = await mutator(current);
    await redis.set(key, data);
    return result;
  }

  // Detect Vercel serverless environment without Redis configured
  if (process.env.VERCEL) {
    throw new Error(
      "Persistent cloud storage is required on Vercel. Vercel functions run on a read-only filesystem (EROFS). Please connect Upstash Redis or Vercel KV in your Vercel Project -> Storage tab."
    );
  }

  // Local filesystem update with file lock
  return withLock(name, async () => {
    const target = filePath(name);
    let current: T;
    try {
      current = JSON.parse(await fs.readFile(target, "utf8")) as T;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
      current = initial();
    }
    const { data, result } = await mutator(current);
    await writeAtomic(target, JSON.stringify(data, null, 2));
    return result;
  });
}
