export function Button({
  children,
  className = "",
  variant = "solid",
  size = "md",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:ring-offset-2 focus:ring-offset-slate-50";

  const variants = {
    solid: "bg-sky-500 text-white hover:bg-sky-400",
    outline:
      "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    icon: "h-8 w-8",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
