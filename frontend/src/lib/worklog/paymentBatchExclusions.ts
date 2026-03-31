import type { WorklogRow } from "./types"

export function filterRowsForPaymentBatch(
  rows: WorklogRow[],
  excludedWorklogIds: string[],
  excludedFreelancerIds: string[],
): WorklogRow[] {
  const worklogs = new Set(excludedWorklogIds)
  const freelancers = new Set(excludedFreelancerIds)
  return rows.filter(
    (r) => !worklogs.has(r.worklogId) && !freelancers.has(r.userId),
  )
}
