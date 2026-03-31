export type WorklogFilterTab = "all" | "date_range"

export type WorklogRow = {
  id: string
  userId: string
  logged_at: string
  userDisplayName: string
  userEmail?: string
  description: string
  status: string
  billable: boolean
  durationMinutes: number
  hourlyRateCents: number
  totalCents: number
  worklogId: string
  worklogSubmittedAt: string
  taskId?: string
}

export type WorklogStats = {
  totalBillableCents: number
  hoursLogged: number
  activeUsers: number
  pendingReview: number
}

export type ExcludedFreelancerRef = {
  userId: string
  displayName: string
}

export type ListProps = {
  pageRows: WorklogRow[]
  totalRowCount: number
  pageSize: number
  safePage: number
  pageCount: number
  onPageChange: (page: number) => void
  onExcludeWorklogFromBatch: (worklogId: string) => void
  onExcludeFreelancerFromBatch: (userId: string, displayName: string) => void
}

export type PaymentBatchExclusionsBarProps = {
  excludedWorklogIds: string[]
  excludedFreelancers: ExcludedFreelancerRef[]
  onRemoveWorklog: (worklogId: string) => void
  onRemoveFreelancer: (userId: string) => void
  onClearAll: () => void
}

export type TimeEntryDetailsProps = {
  row: WorklogRow
}

export type WorklogFiltersProps = {
  filterTab: WorklogFilterTab
  onFilterTabChange: (tab: WorklogFilterTab) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
}
