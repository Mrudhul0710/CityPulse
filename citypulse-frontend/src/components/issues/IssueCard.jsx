import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge.jsx";
import { VoteButton } from "./VoteButton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { ISSUE_CATEGORIES } from "../../constants.js";

const categoryLabel = (value) =>
  ISSUE_CATEGORIES.find((c) => c.value === value)?.label || value;

export function IssueCard({ issue, onVoteChange }) {
  const { user } = useAuth();
  const hasVoted = issue.votes?.some((v) => v.user === user?._id || v.user?._id === user?._id);

  return (
    <Link
      to={`/issues/${issue._id}`}
      className="group flex items-start justify-between gap-4 rounded-lg border border-slate-line bg-paper-raised p-4 transition-shadow hover:shadow-sm"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="rounded bg-pine-light px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-pine-dark">
            {categoryLabel(issue.category)}
          </span>
          <StatusBadge status={issue.status} />
        </div>
        <h3 className="mt-2 truncate font-display text-lg text-ink group-hover:text-pine">
          {issue.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-muted">{issue.description}</p>
        <p className="mt-2 font-mono text-xs text-slate-muted">
          {issue.location?.ward ? `Ward ${issue.location.ward} · ` : ""}
          Reported {new Date(issue.createdAt).toLocaleDateString()}
          {issue.reporter?.name ? ` by ${issue.reporter.name}` : ""}
        </p>
      </div>
      <VoteButton issue={issue} hasVoted={hasVoted} onChange={onVoteChange} />
    </Link>
  );
}
