import type { WorklogRow } from "./types";

/**
 * Whether `logged_at` falls within optional UTC calendar bounds from `YYYY-MM-DD` inputs.
 * Empty `fromYmd` / `toYmd` means unbounded on that side.
 */
export function isLoggedAtInUtcDateRange(
  loggedAt: string,
  fromYmd: string,
  toYmd: string,
): boolean {
  const t = Date.parse(loggedAt);
  if (Number.isNaN(t)) return true;
  if (fromYmd) {
    const start = Date.parse(`${fromYmd}T00:00:00.000Z`);
    if (!Number.isNaN(start) && t < start) return false;
  }
  if (toYmd) {
    const end = Date.parse(`${toYmd}T23:59:59.999Z`);
    if (!Number.isNaN(end) && t > end) return false;
  }
  return true;
}

/** When both bounds are empty, returns all rows. */
export function filterWorklogRowsByUtcLoggedDateRange(
  rows: WorklogRow[],
  fromYmd: string,
  toYmd: string,
): WorklogRow[] {
  if (!fromYmd && !toYmd) return rows;
  return rows.filter((r) =>
    isLoggedAtInUtcDateRange(r.logged_at, fromYmd, toYmd),
  );
}
