type ReactLogoMarkProps = {
  size?: "sm" | "md";
  className?: string;
};

const sizes = {
  sm: "h-9 w-9 rounded-lg p-1.5",
  md: "h-11 w-11 rounded-xl p-2",
} as const;

export default function ReactLogoMark({ size = "sm", className = "" }: ReactLogoMarkProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-brand-gradient shadow-sm ${sizes[size]} ${className}`}
      aria-hidden
    >
      <img
        src="/react-logo.png"
        alt=""
        className="h-full w-full object-contain"
        width={size === "md" ? 44 : 36}
        height={size === "md" ? 44 : 36}
      />
    </span>
  );
}