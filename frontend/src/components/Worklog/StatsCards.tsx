import type { WorklogStats } from "@/lib/worklog/types";
import { formatUsdFromCents } from "@/lib/worklog/worklogUtils";

type StatsCardsProps = {
  stats: WorklogStats;
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-medium uppercase">
          Total billable
        </p>
        <p className="text-primary mt-1 text-2xl font-semibold tabular-nums">
          {formatUsdFromCents(stats.totalBillableCents)}
        </p>
      </div>
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-medium uppercase">
          Hours logged
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {stats.hoursLogged.toFixed(1)}{" "}
          <span className="text-muted-foreground text-base font-normal">
            hrs
          </span>
        </p>
      </div>
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-medium uppercase">
          Active users
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {stats.activeUsers}{" "}
          <span className="text-muted-foreground text-base font-normal">
            members
          </span>
        </p>
      </div>
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <p className="text-muted-foreground text-xs font-medium uppercase">
          Pending approval
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {String(stats.pendingReview).padStart(2, "0")}{" "}
          <span className="text-muted-foreground text-base font-normal">
            in review
          </span>
        </p>
      </div>
    </div>
  );
}
