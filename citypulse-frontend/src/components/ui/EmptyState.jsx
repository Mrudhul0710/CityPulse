export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-line bg-paper-raised px-6 py-16 text-center">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
