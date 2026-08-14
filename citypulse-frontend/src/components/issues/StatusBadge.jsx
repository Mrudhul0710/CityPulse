import { STATUS_LABELS } from "../../constants.js";

// Which visual treatment each status gets. "Active" statuses (still
// moving through the workflow) get the pulse ring; resolved/closed don't,
// since the pulse specifically means "this needs attention / is alive."
const STATUS_STYLES = {
  reported: { dot: "bg-slate-muted", text: "text-slate-muted", pulse: true },
  verified: { dot: "bg-amber", text: "text-amber", pulse: true },
  assigned: { dot: "bg-amber", text: "text-amber", pulse: true },
  in_progress: { dot: "bg-pine", text: "text-pine", pulse: true },
  resolved: { dot: "bg-pine", text: "text-pine-dark", pulse: false },
  closed: { dot: "bg-slate-muted", text: "text-slate-muted", pulse: false },
  reopened: { dot: "bg-brick", text: "text-brick", pulse: true },
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.reported;

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${style.text}`}>
      <span className="relative flex h-2 w-2">
        {style.pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${style.dot} animate-pulse-ring`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${style.dot}`} />
      </span>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
