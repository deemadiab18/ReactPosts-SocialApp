import { Input } from "@heroui/react";
import { useState, type ComponentProps } from "react";

type PasswordInputProps = ComponentProps<typeof Input>;

export default function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={`auth-input ${props.className ?? ""}`}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600"
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? (
          <EyeOffIcon />
        ) : (
          <EyeIcon />
        )}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M6.7 6.8C4.6 8.4 3 10.4 2 12c0 0 3.5 7 10 7 1.5 0 2.9-.3 4.1-.8M9.5 5.1A10.2 10.2 0 0112 5c6.5 0 10 7 10 7a16.5 16.5 0 01-4.2 4.9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}