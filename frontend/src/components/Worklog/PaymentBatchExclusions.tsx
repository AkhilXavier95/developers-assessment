"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PaymentBatchExclusionsBarProps } from "@/lib/worklog/types";

export function PaymentBatchExclusions({
  excludedWorklogIds,
  excludedFreelancers,
  onRemoveWorklog,
  onRemoveFreelancer,
  onClearAll,
}: PaymentBatchExclusionsBarProps) {
  const hasAny =
    excludedWorklogIds.length > 0 || excludedFreelancers.length > 0;

  if (!hasAny) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl border p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Excluded from payment batch
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            These worklogs and freelancers are omitted from totals and the list
            until you remove the exclusion.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {excludedWorklogIds.map((id) => (
              <span
                key={id}
                className="bg-muted/50 inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              >
                <span className="text-muted-foreground shrink-0 font-medium">
                  Worklog
                </span>
                <span className="font-mono truncate">{id}</span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground -me-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors"
                  aria-label={`Include worklog ${id} in batch again`}
                  onClick={() => {
                    onRemoveWorklog(id);
                  }}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </span>
            ))}
            {excludedFreelancers.map((f) => (
              <span
                key={f.userId}
                className="bg-muted/50 inline-flex max-w-full items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
              >
                <span className="min-w-0 truncate font-medium">
                  {f.displayName}
                </span>
                <span className="text-muted-foreground shrink-0 font-mono">
                  {f.userId}
                </span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground -me-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full transition-colors"
                  aria-label={`Include freelancer ${f.displayName} in batch again`}
                  onClick={() => {
                    onRemoveFreelancer(f.userId);
                  }}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </span>
            ))}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onClearAll}
        >
          Clear all exclusions
        </Button>
      </div>
    </div>
  );
}
