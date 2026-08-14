import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl text-ink">404</h1>
      <p className="mt-2 text-slate-muted">This page doesn't exist.</p>
      <Link to="/issues" className="mt-6">
        <Button>Back to issues</Button>
      </Link>
    </div>
  );
}
