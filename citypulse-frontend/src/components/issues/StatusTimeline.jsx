import { STATUS_LABELS } from "../../constants.js";

// The Final Issue Lifecycle from the PRD, in visual order. "reopened" is
// deliberately excluded from the main spine -- it's a branch, not a step,
// and gets called out separately if it appears in the issue's history.
const LIFECYCLE_ORDER = ["reported", "verified", "assigned", "in_progress", "resolved", "closed"];

export function StatusTimeline({ history = [], currentStatus }) {
  const currentIndex = LIFECYCLE_ORDER.indexOf(currentStatus);
  const historyByStatus = Object.fromEntries(
    history.map((h) => [h.status, h])
  );

  return (
    <ol className="relative">
      {LIFECYCLE_ORDER.map((status, i) => {
        const isDone = i < currentIndex || (i === currentIndex && currentStatus !== "reopened");
        const isCurrent = i === currentIndex;
        const entry = historyByStatus[status];
        const isLast = i === LIFECYCLE_ORDER.length - 1;

        return (
          <li key={status} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[7px] top-4 h-full w-px ${
                  isDone ? "bg-pine" : "bg-slate-line"
                }`}
              />
            )}
            <span className="relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
              {isCurrent && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-pine animate-pulse-ring" />
              )}
              <span
                className={`relative h-3 w-3 rounded-full border-2 ${
                  isDone
                    ? "border-pine bg-pine"
                    : "border-slate-line bg-paper-raised"
                }`}
              />
            </span>
            <div className="min-w-0">
              <p
                className={`text-sm font-medium ${
                  isDone ? "text-ink" : "text-slate-muted"
                }`}
              >
                {STATUS_LABELS[status]}
              </p>
              {entry && (
                <p className="mt-0.5 font-mono text-xs text-slate-muted">
                  {new Date(entry.changedAt).toLocaleString()}
                  {entry.note ? ` — ${entry.note}` : ""}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
