import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Button } from "../ui/Button.jsx";
import { ROLES } from "../../constants.js";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="border-b border-slate-line bg-paper-raised">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-pine animate-pulse-ring" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pine" />
          </span>
          <span className="font-display text-xl font-semibold text-ink">CityPulse</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {user && (
            <>
              <Link to="/issues" className="text-ink hover:text-pine">
                Issues
              </Link>
              <Link to="/report" className="text-ink hover:text-pine">
                Report an issue
              </Link>
              {(user.role === ROLES.ADMIN) && (
                <Link to="/departments" className="text-ink hover:text-pine">
                  Departments
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-muted sm:inline">
                {user.name} <span className="font-mono text-xs">· {user.role}</span>
              </span>
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
