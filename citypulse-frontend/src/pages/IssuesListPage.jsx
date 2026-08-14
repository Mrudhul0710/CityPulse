import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { issuesApi } from "../api/issues.api.js";
import { IssueCard } from "../components/issues/IssueCard.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Select } from "../components/ui/Input.jsx";
import { ISSUE_CATEGORIES, ISSUE_STATUS_LIST, STATUS_LABELS } from "../constants.js";

export function IssuesListPage() {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "", category: "" });

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const query = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));

    issuesApi
      .list(query)
      .then(({ issues }) => !cancelled && setIssues(issues))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
  }, [filters]);

  function handleVoteChange(updatedIssue, errorMessage) {
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setIssues((prev) => prev.map((i) => (i._id === updatedIssue._id ? updatedIssue : i)));
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Civic Issues</h1>
          <p className="mt-1 text-sm text-slate-muted">
            Reported problems across the city, newest first.
          </p>
        </div>
        <Link to="/report">
          <Button>Report an issue</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Select
          className="w-auto"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          {ISSUE_STATUS_LIST.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select
          className="w-auto"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All categories</option>
          {ISSUE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-brick-light px-3 py-2 text-sm text-brick">{error}</p>
      )}

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-muted">Loading issues…</p>
        ) : issues.length === 0 ? (
          <EmptyState
            title="No issues match these filters"
            description="Try clearing a filter, or be the first to report something in your area."
            action={
              <Link to="/report">
                <Button variant="secondary">Report an issue</Button>
              </Link>
            }
          />
        ) : (
          issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} onVoteChange={handleVoteChange} />
          ))
        )}
      </div>
    </div>
  );
}
