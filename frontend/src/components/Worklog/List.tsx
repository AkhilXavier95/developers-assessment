"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { ListProps, WorklogRow } from "@/lib/worklog/types";
import {
  entryStatusTextClass,
  formatEntryStatusLabel,
  formatLoggedAtUtcTwoLines,
  formatUsdFromCents,
  initials,
} from "@/lib/worklog/worklogUtils";
import { cn } from "@/lib/utils";

import { TimeEntryDetails } from "./TimeEntryDetails";

const gridCols =
  "md:grid-cols-[10.5rem_minmax(10rem,1.25fr)_minmax(0,2.75fr)_5rem_5rem_5rem_2.5rem]";

const entryGridClass = `md:grid ${gridCols} md:items-center md:gap-x-6 md:gap-y-2 md:py-3`;

export function List({
  pageRows,
  totalRowCount,
  pageSize,
  safePage,
  pageCount,
  onPageChange,
  onExcludeWorklogFromBatch,
  onExcludeFreelancerFromBatch,
  onApproveTimeEntry,
  onRejectTimeEntry,
}: ListProps) {
  const [detailRow, setDetailRow] = useState<WorklogRow | null>(null);

  return (
    <div className="relative">
      <div
        className={`text-muted-foreground mb-3 hidden rounded-xl border border-transparent p-3 text-xs font-medium uppercase md:grid ${gridCols} md:items-center md:gap-x-6 md:gap-y-2 md:py-2`}
      >
        <span>Date</span>
        <span>User</span>
        <span>Task</span>
        <span className="text-right">Duration</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Total</span>
        <span className="text-right">Action</span>
      </div>

      <ul className="flex flex-col gap-2">
        {pageRows.map((row) => {
          const { line1, line2 } = formatLoggedAtUtcTwoLines(row.logged_at);
          return (
            <li
              key={row.id}
              className={`bg-card border rounded-xl p-3 shadow-sm transition-colors ${entryGridClass}`}
            >
              <div className="flex flex-col gap-3 md:contents">
                <div className="min-w-0 md:min-w-[10.5rem] md:shrink-0 md:text-sm">
                  <p
                    className="text-muted-foreground text-sm leading-tight"
                    title={row.logged_at}
                  >
                    <span className="block whitespace-nowrap">{line1}</span>
                    <span className="block whitespace-nowrap">{line2}</span>
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs md:hidden">
                    {row.worklogId}
                  </p>
                </div>
                <div className="flex min-w-0 items-center gap-2 md:min-w-0 md:overflow-hidden">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {initials(row.userDisplayName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">
                    {row.userDisplayName}
                  </span>
                </div>
                <div className="min-w-0 md:col-span-1">
                  <p className="text-sm font-semibold leading-snug">
                    {row.description}
                  </p>
                  <p className="mt-0.5 text-xs">
                    <span
                      className={cn(
                        "uppercase",
                        entryStatusTextClass(row.status),
                      )}
                    >
                      {formatEntryStatusLabel(row.status)}
                    </span>
                    <span className="text-muted-foreground"> • </span>
                    <span className="text-muted-foreground uppercase">
                      {row.billable ? "Billable" : "Non-billable"}
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-1 font-mono text-xs md:hidden">
                    Worklog {row.worklogId}
                  </p>
                </div>
                <p className="text-sm tabular-nums md:text-right">
                  {(row.durationMinutes / 60).toFixed(1)}{" "}
                  <span className="text-muted-foreground">hrs</span>
                </p>
                <p className="text-sm tabular-nums md:text-right">
                  {formatUsdFromCents(row.hourlyRateCents)}/h
                </p>
                <p className="text-primary text-sm font-semibold tabular-nums md:text-right">
                  {formatUsdFromCents(row.totalCents)}
                </p>
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Actions for ${row.description}`}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => {
                          setDetailRow(row);
                        }}
                      >
                        View Time Entry
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          onExcludeWorklogFromBatch(row.worklogId);
                        }}
                      >
                        Exclude worklog from batch
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          onExcludeFreelancerFromBatch(
                            row.userId,
                            row.userDisplayName,
                          );
                        }}
                      >
                        Exclude freelancer from batch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {totalRowCount > pageSize ? (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Page {safePage} of {pageCount}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage >= pageCount}
              onClick={() => onPageChange(Math.min(pageCount, safePage + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <Sheet
        open={detailRow !== null}
        onOpenChange={(open) => {
          if (!open) setDetailRow(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-y-auto border-l p-0 sm:max-w-3xl lg:max-w-4xl"
        >
          {detailRow ? (
            <TimeEntryDetails
              row={detailRow}
              onApproveEntry={(entryId) => {
                onApproveTimeEntry(entryId);
                setDetailRow((prev) =>
                  prev?.id === entryId ? { ...prev, status: "approved" } : prev,
                );
              }}
              onRejectEntry={(entryId) => {
                onRejectTimeEntry(entryId);
                setDetailRow((prev) =>
                  prev?.id === entryId ? { ...prev, status: "rejected" } : prev,
                );
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
