import type { ReactNode } from "react";

type AuthFormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
};

export default function AuthFormField({ label, htmlFor, error, children }: AuthFormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="auth-field-label">
        {label}
      </label>
      {children}
      {error && <p className="auth-field-error">{error}</p>}
    </div>
  );
}