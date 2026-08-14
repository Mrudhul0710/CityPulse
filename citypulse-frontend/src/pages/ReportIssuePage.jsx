import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { issuesApi } from "../api/issues.api.js";
import { Field, Input, Textarea, Select } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { ISSUE_CATEGORIES } from "../constants.js";
import { IssueCard } from "../components/issues/IssueCard.jsx";

const initialForm = {
  title: "",
  description: "",
  category: "",
  latitude: "",
  longitude: "",
  address: "",
  ward: "",
};

export function ReportIssuePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateFound, setDuplicateFound] = useState(null); // existingIssue, if the backend flags one
  const [locating, setLocating] = useState(false);

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support geolocation. Enter coordinates manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location. Enter coordinates manually.");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setDuplicateFound(null);
    setIsSubmitting(true);
    try {
      const result = await issuesApi.create(form);
      if (result.existingIssue) {
        // Duplicate Detection step from the Final Issue Lifecycle: don't
        // silently create a second record, surface the match instead.
        setDuplicateFound(result.existingIssue);
      } else {
        navigate(`/issues/${result.issue._id}`);
      }
    } catch (err) {
      setError(err.details?.join(", ") || err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (duplicateFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-display text-2xl text-ink">A similar issue already exists nearby</h1>
        <p className="mt-2 text-sm text-slate-muted">
          Rather than create a duplicate, consider upvoting this one to help it get
          prioritized.
        </p>
        <div className="mt-6">
          <IssueCard issue={duplicateFound} onVoteChange={() => {}} />
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => setDuplicateFound(null)}>
            Report something different instead
          </Button>
          <Link to={`/issues/${duplicateFound._id}`}>
            <Button>View full details</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-display text-3xl text-ink">Report an issue</h1>
      <p className="mt-1 text-sm text-slate-muted">
        We'll check for similar reports nearby before creating a new one.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Title">
          <Input
            required
            minLength={5}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Broken streetlight on 5th Ave"
          />
        </Field>

        <Field label="Description">
          <Textarea
            required
            minLength={10}
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what's wrong and how long it's been an issue"
          />
        </Field>

        <Field label="Category">
          <Select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {ISSUE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>

        <div className="rounded-md border border-slate-line bg-paper-raised p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Location</span>
            <Button
              type="button"
              variant="secondary"
              onClick={useMyLocation}
              disabled={locating}
            >
              {locating ? "Locating…" : "Use my location"}
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Latitude">
              <Input
                required
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              />
            </Field>
            <Field label="Longitude">
              <Input
                required
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Address (optional)">
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 5th Ave"
              />
            </Field>
          </div>
        </div>

        {error && (
          <p className="rounded-md bg-brick-light px-3 py-2 text-sm text-brick">{error}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting…" : "Submit report"}
        </Button>
      </form>
    </div>
  );
}
