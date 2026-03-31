"use client";

import { Button } from "@/components/ui/button";
import type { WorklogHeaderProps } from "@/lib/worklog/types";

export function Header({
  reviewPayApprovedCount,
  onReviewPayClick,
}: WorklogHeaderProps) {
  const n = reviewPayApprovedCount;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Worklogs</h1>
      </div>
      <div className="flex shrink-0 justify-end">
        <Button
          type="button"
          size="sm"
          disabled={n === 0}
          onClick={onReviewPayClick}
          aria-label={
            n === 0
              ? "Review and pay (no approved entries)"
              : `Review and pay, ${n} approved entries`
          }
        >
          Review and pay{n > 0 ? ` (${n})` : ""}
        </Button>
      </div>
    </div>
  );
}
