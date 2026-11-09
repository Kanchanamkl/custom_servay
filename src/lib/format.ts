const lkr = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });

export function formatLkr(min: number, max?: number | null) {
  if (max == null || max === min) return `LKR ${lkr.format(min)}`;
  return `LKR ${lkr.format(min)} – ${lkr.format(max)}`;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  }).format(new Date(iso));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Colombo",
  }).format(new Date(iso));
}

export function percent(part: number, total: number) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

