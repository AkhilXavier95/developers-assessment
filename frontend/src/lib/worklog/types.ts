export type WorklogRow = {
  id: string
  logged_at: string
  userDisplayName: string
  description: string
  status: string
  billable: boolean
  durationMinutes: number
  hourlyRateCents: number
  totalCents: number
  worklogId: string
  worklogSubmittedAt: string
}

export type WorklogStats = {
  totalBillableCents: number
  hoursLogged: number
  activeUsers: number
  pendingReview: number
}
