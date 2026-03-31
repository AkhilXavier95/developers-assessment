"use client";

import { Button } from "@/components/ui/button";
import { SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { TimeEntryDetailsProps } from "@/lib/worklog/types";
import {
  entryStatusTextClass,
  formatDateOnlyUtc,
  formatEntryStatusLabel,
  formatUsdFromCents,
} from "@/lib/worklog/worklogUtils";
import { cn } from "@/lib/utils";

import { MetricCard, metricLabelClass } from "./MetricCard";

export function TimeEntryDetails({
  row,
  onApproveEntry,
  onRejectEntry,
}: TimeEntryDetailsProps) {
  const hours = (row.durationMinutes / 60).toFixed(1);
  const dateLabel = formatDateOnlyUtc(row.logged_at);
  const pendingReview = row.status === "pending_review";
  return (
    <div className="flex flex-col gap-8 px-6 pb-8 pt-6">
      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <SheetTitle className="text-foreground pr-10 text-left text-2xl font-bold tracking-tight lg:pr-0">
          {row.description}
        </SheetTitle>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <div className="flex items-center gap-2">
            {pendingReview ? (
              <span
                className="bg-primary size-2 shrink-0 rounded-full animate-pulse"
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                "text-sm uppercase",
                entryStatusTextClass(row.status),
              )}
            >
              {formatEntryStatusLabel(row.status)}
            </span>
          </div>
          {pendingReview ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Button
                type="button"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  onApproveEntry(row.id);
                }}
              >
                Approve entry
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive w-full border-destructive/50 sm:w-auto"
                onClick={() => {
                  onRejectEntry(row.id);
                }}
              >
                Reject entry
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <SheetDescription className="sr-only">
        Time entry {row.id} for worklog {row.worklogId}
      </SheetDescription>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <MetricCard label="Freelancer">
          <p>{row.userDisplayName}</p>
          {row.userEmail ? (
            <p
              className="text-muted-foreground mt-1 break-words text-xs font-normal"
              title={row.userEmail}
            >
              {row.userEmail}
            </p>
          ) : null}
        </MetricCard>
        <MetricCard label="Date">
          <p className="tabular-nums">{dateLabel}</p>
        </MetricCard>
        <MetricCard label="Hours">
          <span className="text-lg tabular-nums">{hours}</span>{" "}
          <span className="text-muted-foreground text-sm font-normal">hrs</span>
        </MetricCard>
        <MetricCard label="Hourly rate">
          <span className="tabular-nums">
            {formatUsdFromCents(row.hourlyRateCents)}
          </span>
          <span className="text-muted-foreground font-normal">/h</span>
        </MetricCard>
        <MetricCard label="Total amount" emphasize>
          <span className="text-primary text-lg tabular-nums">
            {formatUsdFromCents(row.totalCents)}
          </span>
        </MetricCard>
      </div>

      <section className="min-w-0 space-y-3">
        <h2 className={metricLabelClass}>Detailed worklog description</h2>
        <div className="bg-muted/40 rounded-xl border p-4">
          <p className="text-sm leading-relaxed">{row.description}</p>
        </div>
      </section>
    </div>
  );
}
