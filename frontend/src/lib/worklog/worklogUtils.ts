export function initials(displayName: string) {
  const parts = displayName.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
  }
  return (displayName.slice(0, 2) || "?").toUpperCase()
}

/** Date-only label in UTC (e.g. billing period bounds). */
export function formatDateOnlyUtc(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d)
}

/**
 * Two-line UTC display, e.g.
 *   Mar 19,
 *   2026 2:00PM UTC
 */
export function formatLoggedAtUtcTwoLines(iso: string): {
  line1: string
  line2: string
} {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return { line1: iso, line2: "" }
  }

  const line1 = `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d)},`

  const year = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "UTC",
  }).format(d)

  let timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(d)
  timePart = timePart.replace(/\s+(AM|PM)$/i, (_, ap: string) =>
    ap.toUpperCase(),
  )

  return {
    line1,
    line2: `${year} ${timePart} UTC`,
  }
}

export function formatUsdFromCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

export function entryTotalEarningsCents(entry: {
  duration_minutes: number
  hourly_rate_cents: number
  billable: boolean
}) {
  if (!entry.billable) return 0
  const hours = entry.duration_minutes / 60
  return Math.round(hours * entry.hourly_rate_cents)
}
