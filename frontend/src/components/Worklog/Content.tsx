import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import {
  buildLogList,
  computeWorklogStatsFromRows,
} from "@/lib/worklog/buildLogList";
import { filterWorklogRowsByUtcLoggedDateRange } from "@/lib/worklog/worklogDateRange";
import { getWorklogQueryOptions } from "@/lib/worklog/worklogQueryOptions";
import type { WorklogFilterTab } from "@/lib/worklog/types";
import { Header } from "./Header";
import { List } from "./List";
import { StatsCards } from "./StatsCards";
import { WorklogFilters } from "./WorklogFilters";

export function Content() {
  const { data } = useSuspenseQuery(getWorklogQueryOptions());

  const { rows: allRows } = useMemo(() => buildLogList(data), [data]);

  const [filterTab, setFilterTab] = useState<WorklogFilterTab>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const rows = useMemo(() => {
    if (filterTab === "all") return allRows;
    return filterWorklogRowsByUtcLoggedDateRange(allRows, dateFrom, dateTo);
  }, [allRows, filterTab, dateFrom, dateTo]);

  const stats = useMemo(() => computeWorklogStatsFromRows(rows), [rows]);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
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
      <List
        pageRows={pageRows}
        totalRowCount={rows.length}
        pageSize={pageSize}
        safePage={safePage}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
