import { useState } from "react";
import { issuesApi } from "../../api/issues.api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { ROLES } from "../../constants.js";

export function VoteButton({ issue, hasVoted, onChange }) {
  const { user } = useAuth();
  const [isBusy, setIsBusy] = useState(false);

  if (!user || user.role !== ROLES.CITIZEN) return null;

  async function toggleVote(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsBusy(true);
    try {
      const updated = hasVoted
        ? await issuesApi.unvote(issue._id)
        : await issuesApi.vote(issue._id);
      onChange?.(updated);
    } catch (err) {
      onChange?.(null, err.message);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <button
      onClick={toggleVote}
      disabled={isBusy}
      className={`flex flex-col items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
        hasVoted
          ? "border-pine bg-pine-light text-pine-dark"
          : "border-slate-line text-slate-muted hover:border-pine hover:text-pine"
      }`}
      aria-pressed={hasVoted}
    >
      <span className="font-mono text-sm font-semibold">{issue.voteCount ?? 0}</span>
      {hasVoted ? "Voted" : "Upvote"}
    </button>
  );
}
