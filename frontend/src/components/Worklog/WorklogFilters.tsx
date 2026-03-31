"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { WorklogFiltersProps } from "@/lib/worklog/types";
import { formatUtcYmdBillingRangeSummary } from "@/lib/worklog/worklogUtils";
import { cn } from "@/lib/utils";

export function WorklogFilters({
  filterTab,
  onFilterTabChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: WorklogFiltersProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const rangeLine =
    filterTab === "all"
      ? "All entries"
      : formatUtcYmdBillingRangeSummary(dateFrom, dateTo);

  const handleMenuOpenChange = (next: boolean) => {
    setMenuOpen(next);
    if (!next) {
      document.getElementById("worklog-filter-date-from")?.blur();
      document.getElementById("worklog-filter-date-to")?.blur();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <DropdownMenu open={menuOpen} onOpenChange={handleMenuOpenChange}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "bg-card border-input hover:bg-accent/40 flex w-full max-w-md items-center gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition-colors",
                "focus-visible:ring-ring focus-visible:ring-[3px] focus-visible:outline-none",
              )}
            >
              <span className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                <CalendarDays className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-muted-foreground block text-[11px] font-semibold tracking-wider uppercase">
                  Billing period
                </span>
                <span className="mt-0.5 block truncate text-base font-semibold tracking-tight">
                  {rangeLine}
                </span>
              </span>
              <ChevronDown
                className="text-muted-foreground size-5 shrink-0 opacity-80"
                aria-hidden
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[min(100vw-2rem,20rem)] p-0"
            align="start"
            sideOffset={8}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
            }}
          >
            <div className="p-4">
              <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
                Logged at (UTC dates)
              </p>
              <div className="space-y-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="worklog-filter-date-from" className="text-xs">
                    From
                  </Label>
                  <Input
                    id="worklog-filter-date-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      onDateFromChange(e.target.value);
                      onFilterTabChange("date_range");
                    }}
                    className="font-mono"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="worklog-filter-date-to" className="text-xs">
                    Through
                  </Label>
                  <Input
                    id="worklog-filter-date-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      onDateToChange(e.target.value);
                      onFilterTabChange("date_range");
                    }}
                    className="font-mono"
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-8 w-full justify-center font-normal"
                onClick={() => {
                  onFilterTabChange("all");
                  onDateFromChange("");
                  onDateToChange("");
                  handleMenuOpenChange(false);
                }}
              >
                Show all entries
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-muted-foreground max-w-2xl text-sm">
        Filter time entries by <span className="font-medium">logged date</span>{" "}
        in UTC to match a billing or payroll window. The summary cards reflect
        the current period.
      </p>
    </div>
  );
}
