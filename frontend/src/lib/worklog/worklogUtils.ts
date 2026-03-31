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

function utcMonthDayFromYmd(ymd: string) {
  const t = Date.parse(`${ymd}T12:00:00.000Z`)
  if (Number.isNaN(t)) return ymd
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(t)
}

function utcYearFromYmd(ymd: string) {
  const t = Date.parse(`${ymd}T12:00:00.000Z`)
  if (Number.isNaN(t)) return ""
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: "UTC",
  }).format(t)
}

export function formatUtcYmdBillingRangeSummary(
  fromYmd: string,
  toYmd: string,
): string {
  if (!fromYmd && !toYmd) return "Select date range"
  if (fromYmd && toYmd) {
    const y1 = utcYearFromYmd(fromYmd)
    const y2 = utcYearFromYmd(toYmd)
    const m1 = utcMonthDayFromYmd(fromYmd)
    const m2 = utcMonthDayFromYmd(toYmd)
    if (y1 === y2) {
      return `${m1} – ${m2}, ${y1}`
    }
    return `${m1}, ${y1} – ${m2}, ${y2}`
  }
  if (fromYmd) {
    return `From ${utcMonthDayFromYmd(fromYmd)}, ${utcYearFromYmd(fromYmd)}`
  }
  return `Through ${utcMonthDayFromYmd(toYmd)}, ${utcYearFromYmd(toYmd)}`
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

export function formatEntryStatusLabel(status: string) {
  return status.replace(/_/g, " ")
}

/** Text color classes for time entry status in tables and detail views. */
export function entryStatusTextClass(status: string): string {
  if (status === "approved") {
    return "font-medium text-emerald-700 dark:text-emerald-400"
  }
  if (status === "rejected") {
    return "font-medium text-destructive"
  }
  if (status === "pending_review") {
    return "font-medium text-amber-700 dark:text-amber-400"
  }
  return "font-medium text-muted-foreground"
}
