import { Button } from "@heroui/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthCountext";
import { LogOutIcon } from "../layout/NavIcons";

type LogoutButtonProps = {
  layout?: "sidebar" | "header";
};

export default function LogoutButton({ layout = "sidebar" }: LogoutButtonProps) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    auth?.updateToken(null);
    navigate("/auth/login");
  }

  if (layout === "header") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-brand-800 sm:px-3"
        aria-label="Log out"
      >
        <LogOutIcon />
        <span className="hidden sm:inline">Log out</span>
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant="tertiary"
      fullWidth
      className="mt-4 justify-start font-bold text-slate-600 dark:text-slate-300"
      onPress={handleLogout}
    >
      <LogOutIcon className="mr-2" />
      Log out
    </Button>
  );
}