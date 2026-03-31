import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { buildLogList } from "@/lib/worklog/buildLogList";
import { getWorklogQueryOptions } from "@/lib/worklog/worklogQueryOptions";
import { Header } from "./Header";
import { List } from "./List";
import { StatsCards } from "./StatsCards";

export function Content() {
  const { data } = useSuspenseQuery(getWorklogQueryOptions());

  const { rows, stats } = useMemo(() => buildLogList(data), [data]);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <Header />
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
