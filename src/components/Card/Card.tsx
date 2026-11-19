import type { ReactNode } from "react";

export default function Card({ children }: { children?: ReactNode }) {
  return (
    <div>
      Card
      {children}
    </div>
  );
}