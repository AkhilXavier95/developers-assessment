"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WorklogReviewPayDialogProps } from "@/lib/worklog/types";
import {
  formatDateOnlyUtc,
  formatUsdFromCents,
} from "@/lib/worklog/worklogUtils";

export function WorklogReviewPayDialog({
  open,
  onOpenChange,
  entries,
}: WorklogReviewPayDialogProps) {
  const totalCents = entries.reduce((acc, r) => acc + r.totalCents, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[min(90vh,640px)] w-full max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>Review and pay</DialogTitle>
          <DialogDescription>
            Approved time entries in your current billing view, excluding any
            worklogs or freelancers removed from this batch. Non-billable lines
            show $0.00.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          {entries.length === 0 ? (
            <p className="text-muted-foreground py-8 text-sm">
              No approved entries in this batch. Approve items from the list or
              adjust filters and exclusions.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Freelancer</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Worklog</TableHead>
                  <TableHead>Logged (UTC)</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="max-w-[8rem] truncate font-medium">
                      {row.userDisplayName}
                    </TableCell>
                    <TableCell className="max-w-[14rem]">
                      <span className="line-clamp-2 text-sm">
                        {row.description}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.worklogId}
                    </TableCell>
                    <TableCell
                      className="whitespace-nowrap text-xs"
                      title={row.logged_at}
                    >
                      {formatDateOnlyUtc(row.logged_at)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {(row.durationMinutes / 60).toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatUsdFromCents(row.totalCents)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter className="bg-muted/30 shrink-0 flex-col gap-4 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Batch total</span>
            <p className="text-primary text-xl font-semibold tabular-nums">
              {formatUsdFromCents(totalCents)}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {entries.length} line{entries.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={entries.length === 0}
              onClick={() => {
                toast.info("Payment processing is not connected yet.");
              }}
            >
              Pay
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
