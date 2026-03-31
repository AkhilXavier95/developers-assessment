import type { WorklogRow, WorklogStats } from "./types"
import { entryTotalEarningsCents } from "./worklogUtils"

export function buildLogList(data: any): {
  rows: WorklogRow[]
  stats: WorklogStats
} {
  const wlMap = new Map<string, any>()
  for (const w of data.worklogs.data ?? []) {
    wlMap.set(w.id, w)
  }
  const userMap = new Map<string, any>()
  for (const u of data.freelancers.data ?? []) {
    userMap.set(u.id, u)
  }

  const entries = [...(data.timeEntries.data ?? [])].sort((a: any, b: any) =>
    a.logged_at < b.logged_at ? 1 : -1,
  )

  const rows: WorklogRow[] = entries.map((entry: any) => {
    const user = userMap.get(entry.user_id)
    const worklog = wlMap.get(entry.worklog_id)
    const totalCents = entryTotalEarningsCents(entry)
    return {
      id: entry.id as string,
      logged_at: entry.logged_at as string,
      userDisplayName: (user?.display_name as string) ?? entry.user_id,
      userEmail: user?.email as string | undefined,
      description: entry.description as string,
      status: entry.status as string,
      billable: Boolean(entry.billable),
      durationMinutes: entry.duration_minutes as number,
      hourlyRateCents: entry.hourly_rate_cents as number,
      totalCents,
      worklogId: entry.worklog_id as string,
      worklogSubmittedAt: (worklog?.submitted_at as string) ?? "",
      taskId: entry.task_id as string | undefined,
    }
  })

  let billableCents = 0
  let totalMinutes = 0
  const userIds = new Set<string>()
  let pendingReview = 0

  for (const entry of entries as any[]) {
    totalMinutes += entry.duration_minutes
    userIds.add(entry.user_id)
    if (entry.status === "pending_review") pendingReview += 1
    if (entry.billable) {
      billableCents += entryTotalEarningsCents(entry)
    }
  }

  const stats: WorklogStats = {
    totalBillableCents: billableCents,
    hoursLogged: totalMinutes / 60,
    activeUsers: userIds.size,
    pendingReview,
  }

  return { rows, stats }
}
