import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Minimal JSON-file storage.
 *
 * - Data lives in ./data (override with DATA_DIR).
 * - Writes are serialised per file with an in-process lock and written
 *   atomically (temp file + rename) so a crash never leaves half-written JSON.
 *
 * NOTE: this needs a persistent, writable disk (local machine or VPS).
 * Serverless hosts such as Vercel do not keep files between requests.
 */
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

const locks = new Map<string, Promise<unknown>>();

function filePath(name: string) {
  return path.join(DATA_DIR, name);
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

export async function readJson<T>(name: string, initial: () => T): Promise<T> {
  const target = filePath(name);
  try {
    return JSON.parse(await fs.readFile(target, "utf8")) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const value = initial();
    await withLock(name, async () => {
      // Another request may have created it while we waited.
      try {
        await fs.access(target);
      } catch {
        await writeAtomic(target, JSON.stringify(value, null, 2));
      }
    });
    return JSON.parse(await fs.readFile(target, "utf8")) as T;
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

/**
 * Read-modify-write a JSON file under a lock. The mutator returns the new data
 * and an optional result value passed back to the caller.
 */
export function updateJson<T, R = void>(
  name: string,
  initial: () => T,
  mutator: (data: T) => { data: T; result: R } | Promise<{ data: T; result: R }>,
): Promise<R> {
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
