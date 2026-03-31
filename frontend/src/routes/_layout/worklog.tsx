import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

import { Content } from "@/components/Worklog/Content";
import { Pending } from "@/components/Worklog/Pending";
import useAuth from "@/hooks/useAuth";

export const Route = createFileRoute("/_layout/worklog")({
  component: WorklogPage,
  head: () => ({
    meta: [
      {
        title: "Worklog - FastAPI Cloud",
      },
    ],
  }),
});

function WorklogPage() {
  const { user: currentUser } = useAuth();

  if (currentUser === undefined) {
    return <Pending />;
  }

  if (!currentUser?.is_superuser) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Worklog</h1>
        <p className="text-muted-foreground">
          You do not have access to the worklog.
        </p>
      </div>
    );
  }

  return (
    <Suspense fallback={<Pending />}>
      <Content />
    </Suspense>
  );
}
