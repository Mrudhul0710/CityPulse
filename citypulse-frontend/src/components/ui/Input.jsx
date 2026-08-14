export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-brick">{error}</span>}
    </label>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-md border border-slate-line bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-slate-muted focus:border-pine ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-md border border-slate-line bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-slate-muted focus:border-pine ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-md border border-slate-line bg-paper-raised px-3 py-2 text-sm text-ink focus:border-pine ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
