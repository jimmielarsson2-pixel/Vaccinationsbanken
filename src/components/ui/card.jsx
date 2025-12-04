export function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border bg-white ${className}`}>{children}</div>
  );
}

export function CardHeader({ className = "", children }) {
  return (
    <div className={`px-4 pt-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children }) {
  return (
    <h2 className={`font-semibold text-slate-900 ${className}`}>{children}</h2>
  );
}

export function CardContent({ className = "", children }) {
  return (
    <div className={`px-4 pb-3 ${className}`}>
      {children}
    </div>
  );
}
