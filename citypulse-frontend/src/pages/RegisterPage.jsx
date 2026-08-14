import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Field, Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/issues");
    } catch (err) {
      setError(err.details?.join(", ") || err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Create your account</h1>
      <p className="mt-1 text-sm text-slate-muted">
        Citizen accounts can report issues and vote. Officer/admin accounts are
        set up by your administrator.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Full name">
          <Input
            required
            minLength={2}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Asha Rao"
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password" error="Must be at least 8 characters">
          <Input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>

        {error && (
          <p className="rounded-md bg-brick-light px-3 py-2 text-sm text-brick">{error}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-pine">
          Log in
        </Link>
      </p>
    </div>
  );
}
