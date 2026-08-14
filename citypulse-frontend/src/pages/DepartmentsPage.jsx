import { useEffect, useState } from "react";
import { apiClient } from "../api/axiosClient.js";
import { departmentsApi } from "../api/departments.api.js";
import { Field, Input, Select } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { ISSUE_CATEGORIES } from "../constants.js";

export function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", categories: [] });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function refresh() {
    departmentsApi.list().then(setDepartments).catch((err) => setError(err.message));
  }

  useEffect(refresh, []);

  function toggleCategory(value) {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(value)
        ? f.categories.filter((c) => c !== value)
        : [...f.categories, value],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post("/departments", form);
      setForm({ name: "", description: "", categories: [] });
      refresh();
    } catch (err) {
      setError(err.details?.join(", ") || err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-3xl text-ink">Departments</h1>
      <p className="mt-1 text-sm text-slate-muted">
        Categories mapped here power auto-suggested assignment (Hybrid Assignment model).
      </p>

      <div className="mt-6 space-y-2">
        {departments.map((d) => (
          <div key={d._id} className="rounded-md border border-slate-line bg-paper-raised p-4">
            <p className="font-display text-lg text-ink">{d.name}</p>
            {d.description && <p className="text-sm text-slate-muted">{d.description}</p>}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {d.categories.map((c) => (
                <span
                  key={c}
                  className="rounded bg-pine-light px-2 py-0.5 font-mono text-xs text-pine-dark"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-md border border-slate-line bg-paper-raised p-4">
        <h2 className="font-display text-lg text-ink">Add a department</h2>
        <Field label="Name">
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Roads & Infrastructure"
          />
        </Field>
        <Field label="Description">
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">Handles categories</span>
          <div className="flex flex-wrap gap-2">
            {ISSUE_CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => toggleCategory(c.value)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  form.categories.includes(c.value)
                    ? "border-pine bg-pine-light text-pine-dark"
                    : "border-slate-line text-slate-muted"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-md bg-brick-light px-3 py-2 text-sm text-brick">{error}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create department"}
        </Button>
      </form>
    </div>
  );
}
