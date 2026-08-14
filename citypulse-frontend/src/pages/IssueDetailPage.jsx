import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { issuesApi } from "../api/issues.api.js";
import { departmentsApi } from "../api/departments.api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { StatusBadge } from "../components/issues/StatusBadge.jsx";
import { StatusTimeline } from "../components/issues/StatusTimeline.jsx";
import { VoteButton } from "../components/issues/VoteButton.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Select } from "../components/ui/Input.jsx";
import {
  ISSUE_CATEGORIES,
  STATUS_LABELS,
  STATUS_TRANSITIONS,
} from "../constants.js";

const categoryLabel = (value) =>
  ISSUE_CATEGORIES.find((c) => c.value === value)?.label || value;

export function IssueDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    issuesApi
      .getOne(id)
      .then((data) => !cancelled && setIssue(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setIsLoading(false));

    if (user?.role === "admin") {
      departmentsApi.list().then((data) => !cancelled && setDepartments(data));
    }
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  // Which next statuses are legal from here, for this user's role --
  // mirrors the backend's STATUS_TRANSITIONS table exactly (constants.js).
  const availableTransitions = issue
    ? Object.entries(STATUS_TRANSITIONS[issue.status] || {}).filter(([, roles]) =>
        roles.includes(user?.role)
      )
    : [];

  async function handleStatusChange(targetStatus) {
    setIsActing(true);
    setError(null);
    try {
      const updated = await issuesApi.changeStatus(id, { status: targetStatus });
      setIssue(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsActing(false);
    }
  }

  async function handleAssign() {
    if (!selectedDept) return;
    setIsActing(true);
    setError(null);
    try {
      const updated = await issuesApi.assign(id, { department: selectedDept });
      setIssue(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsActing(false);
    }
  }

  if (isLoading) {
    return <p className="mx-auto max-w-3xl px-6 py-12 text-slate-muted">Loading…</p>;
  }
  if (!issue) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-brick">{error || "Issue not found."}</p>
        <Link to="/issues" className="mt-4 inline-block text-pine">
          ← Back to issues
        </Link>
      </div>
    );
  }

  const hasVoted = issue.votes?.some(
    (v) => v.user === user?._id || v.user?._id === user?._id
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link to="/issues" className="text-sm text-pine">
        ← Back to issues
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded bg-pine-light px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-pine-dark">
              {categoryLabel(issue.category)}
            </span>
            <StatusBadge status={issue.status} />
          </div>
          <h1 className="mt-2 font-display text-3xl text-ink">{issue.title}</h1>
        </div>
        <VoteButton
          issue={issue}
          hasVoted={hasVoted}
          onChange={(updated, errMsg) => (updated ? setIssue(updated) : setError(errMsg))}
        />
      </div>

      <p className="mt-4 text-ink">{issue.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs text-slate-muted">
        <div>
          <dt className="uppercase">Reported by</dt>
          <dd className="text-ink">{issue.reporter?.name || "—"}</dd>
        </div>
        <div>
          <dt className="uppercase">Location</dt>
          <dd className="text-ink">
            {issue.location?.address || issue.location?.ward ||
              issue.location?.coordinates?.join(", ")}
          </dd>
        </div>
        <div>
          <dt className="uppercase">Department</dt>
          <dd className="text-ink">{issue.department?.name || "Unassigned"}</dd>
        </div>
        <div>
          <dt className="uppercase">Assigned officer</dt>
          <dd className="text-ink">{issue.assignedOfficer?.name || "Unassigned"}</dd>
        </div>
      </dl>

      {error && (
        <p className="mt-4 rounded-md bg-brick-light px-3 py-2 text-sm text-brick">{error}</p>
      )}

      {/* Role-aware workflow actions -- the backend enforces these too;
          this just avoids showing a button that's guaranteed to fail. */}
      {(availableTransitions.length > 0 || user?.role === "admin") && (
        <div className="mt-6 rounded-md border border-slate-line bg-paper-raised p-4">
          <h2 className="font-display text-lg text-ink">Workflow actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTransitions.map(([targetStatus]) => (
              <Button
                key={targetStatus}
                variant={targetStatus === "reopened" ? "danger" : "primary"}
                disabled={isActing}
                onClick={() => handleStatusChange(targetStatus)}
              >
                Move to {STATUS_LABELS[targetStatus]}
              </Button>
            ))}
          </div>

          {user?.role === "admin" && issue.status === "verified" && (
            <div className="mt-4 flex items-end gap-2 border-t border-slate-line pt-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Assign to department
                </label>
                <Select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </div>
              <Button disabled={isActing || !selectedDept} onClick={handleAssign}>
                Assign
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-display text-lg text-ink">Status timeline</h2>
        <div className="mt-4">
          <StatusTimeline history={issue.history} currentStatus={issue.status} />
        </div>
      </div>
    </div>
  );
}
