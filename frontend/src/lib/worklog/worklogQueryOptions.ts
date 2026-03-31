import { fetchMockFreelancers } from "@/mock/freelancers"
import { fetchMockTimeEntries } from "@/mock/timeEntries"
import { fetchMockWorklogs } from "@/mock/worklogs"

export function getWorklogQueryOptions() {
  return {
    queryKey: ["worklog-mock"],
    queryFn: async () => {
      try {
        const [worklogsRes, timeEntriesRes, freelancersRes] =
          await Promise.all([
            fetchMockWorklogs(),
            fetchMockTimeEntries(),
            fetchMockFreelancers(),
          ])
        return {
          worklogs: worklogsRes,
          timeEntries: timeEntriesRes,
          freelancers: freelancersRes,
        }
      } catch (error) {
        console.error(error)
        throw new Error("Failed to load worklog. Please try again.")
      }
    },
  }
}
