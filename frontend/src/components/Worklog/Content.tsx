import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  buildLogList,
  computeWorklogStatsFromRows,
} from "@/lib/worklog/buildLogList";
import { filterRowsForPaymentBatch } from "@/lib/worklog/paymentBatchExclusions";
import { filterWorklogRowsByUtcLoggedDateRange } from "@/lib/worklog/worklogDateRange";
import { getWorklogQueryOptions } from "@/lib/worklog/worklogQueryOptions";
import type {
  ExcludedFreelancerRef,
  WorklogFilterTab,
} from "@/lib/worklog/types";
import { Header } from "./Header";
import { List } from "./List";
import { PaymentBatchExclusions } from "./PaymentBatchExclusions";
import { StatsCards } from "./StatsCards";
import { WorklogFilters } from "./WorklogFilters";

export function Content() {
  const { data } = useSuspenseQuery(getWorklogQueryOptions());

  const { rows: allRows } = useMemo(() => buildLogList(data), [data]);

  const [filterTab, setFilterTab] = useState<WorklogFilterTab>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const dateFilteredRows = useMemo(() => {
    if (filterTab === "all") return allRows;
    return filterWorklogRowsByUtcLoggedDateRange(allRows, dateFrom, dateTo);
  }, [allRows, filterTab, dateFrom, dateTo]);

  const [excludedWorklogIds, setExcludedWorklogIds] = useState<string[]>([]);
  const [excludedFreelancers, setExcludedFreelancers] = useState<
    ExcludedFreelancerRef[]
  >([]);

  const excludedFreelancerIds = useMemo(
    () => excludedFreelancers.map((f) => f.userId),
    [excludedFreelancers],
  );

  const rows = useMemo(
    () =>
      filterRowsForPaymentBatch(
        dateFilteredRows,
        excludedWorklogIds,
        excludedFreelancerIds,
      ),
    [dateFilteredRows, excludedWorklogIds, excludedFreelancerIds],
  );

  const stats = useMemo(() => computeWorklogStatsFromRows(rows), [rows]);

  const onExcludeWorklogFromBatch = useCallback((worklogId: string) => {
    setExcludedWorklogIds((prev) =>
      prev.includes(worklogId)
        ? prev
        : [...prev, worklogId].sort((a, b) => a.localeCompare(b)),
    );
  }, []);

  const onExcludeFreelancerFromBatch = useCallback(
    (userId: string, displayName: string) => {
      setExcludedFreelancers((prev) =>
        prev.some((f) => f.userId === userId)
          ? prev
          : [...prev, { userId, displayName }].sort((a, b) =>
              a.userId.localeCompare(b.userId),
            ),
      );
    },
    [],
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
    setExcludedWorklogIds([]);
    setExcludedFreelancers([]);
  }, [filterTab, dateFrom, dateTo]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <Header />
      <WorklogFilters
        filterTab={filterTab}
        onFilterTabChange={setFilterTab}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />
      <StatsCards stats={stats} />
      <PaymentBatchExclusions
        excludedWorklogIds={excludedWorklogIds}
        excludedFreelancers={excludedFreelancers}
        onRemoveWorklog={(id) => {
          setExcludedWorklogIds((prev) => prev.filter((w) => w !== id));
        }}
        onRemoveFreelancer={(userId) => {
          setExcludedFreelancers((prev) =>
            prev.filter((f) => f.userId !== userId),
          );
        }}
        onClearAll={() => {
          setExcludedWorklogIds([]);
          setExcludedFreelancers([]);
        }}
      />
      <List
        pageRows={pageRows}
        totalRowCount={rows.length}
        pageSize={pageSize}
        safePage={safePage}
        pageCount={pageCount}
        onPageChange={setPage}
        onExcludeWorklogFromBatch={onExcludeWorklogFromBatch}
        onExcludeFreelancerFromBatch={onExcludeFreelancerFromBatch}
      />
    </div>
  );
}
