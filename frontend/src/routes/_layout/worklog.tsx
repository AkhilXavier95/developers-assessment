import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/worklog")({
  component: Worklog,
  head: () => ({
    meta: [
      {
        title: "Worklog - FastAPI Cloud",
      },
    ],
  }),
});

function Worklog() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Worklog</h1>
      </div>
    </div>
  );
}
