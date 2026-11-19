import { useContext } from "react";
import { AuthContext } from "../context/AuthCountext";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthCountextProvider");
  }
  return ctx;
}