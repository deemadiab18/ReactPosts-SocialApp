/* eslint-disable react-refresh/only-export-components -- mirrors StitchHubCode AuthCountext */
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ApiUser } from "../types/api";

export type AuthContextValue = {
  token: string | null;
  user: ApiUser | null;
  updateToken: (token: string | null) => void;
  updateSession: (token: string | null, user: ApiUser | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): ApiUser | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ApiUser;
  } catch {
    return null;
  }
}

export default function AuthCountextProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token"),
  );
  const [user, setUser] = useState<ApiUser | null>(() => readStoredUser());

  const updateToken = useCallback((nextToken: string | null) => {
    setToken(nextToken);
    if (nextToken == null) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      return;
    }
    localStorage.setItem("token", nextToken);
    setUser(readStoredUser());
  }, []);

  const updateSession = useCallback(
    (nextToken: string | null, nextUser: ApiUser | null) => {
      setToken(nextToken);
      setUser(nextUser);
      if (!nextToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }
      localStorage.setItem("token", nextToken);
      if (nextUser) {
        localStorage.setItem("user", JSON.stringify(nextUser));
      }
    },
    [],
  );

  const logout = useCallback(() => {
    updateToken(null);
  }, [updateToken]);

  const value = useMemo(
    () => ({ token, user, updateToken, updateSession, logout }),
    [logout, token, updateSession, updateToken, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}