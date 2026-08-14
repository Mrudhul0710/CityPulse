import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Field, Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(form);
      navigate("/issues");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-muted">Log in to track and report civic issues.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Email">
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>

        {error && (
          <p className="rounded-md bg-brick-light px-3 py-2 text-sm text-brick">{error}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-muted">
        New to CityPulse?{" "}
        <Link to="/register" className="font-medium text-pine">
          Create an account
        </Link>
      </p>
    </div>
  );
}
