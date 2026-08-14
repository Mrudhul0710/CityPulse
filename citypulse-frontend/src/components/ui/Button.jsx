const VARIANTS = {
  primary: "bg-pine text-white hover:bg-pine-dark disabled:bg-slate-line",
  secondary:
    "bg-transparent text-pine border border-pine hover:bg-pine-light disabled:border-slate-line disabled:text-slate-muted",
  danger: "bg-brick text-white hover:bg-brick/90 disabled:bg-slate-line",
  ghost: "bg-transparent text-ink hover:bg-black/5",
};

export function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
