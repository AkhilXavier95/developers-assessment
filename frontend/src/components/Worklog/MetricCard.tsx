import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const metricLabelClass =
  "text-muted-foreground text-[11px] font-semibold uppercase tracking-wider";

type MetricCardProps = {
  label: string;
  emphasize?: boolean;
  children: ReactNode;
};

export function MetricCard({ label, emphasize, children }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-card min-w-0 rounded-xl border p-4 shadow-sm",
        emphasize &&
          "border-primary/30 bg-primary/5 border-l-primary border-l-4",
      )}
    >
      <p className={metricLabelClass}>{label}</p>
      <div className="mt-2 min-h-[2.5rem] min-w-0 text-sm font-semibold leading-snug">
        {children}
      </div>
    </div>
  );
}
