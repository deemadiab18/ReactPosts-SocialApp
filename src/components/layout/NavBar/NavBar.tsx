import { Input } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import LogoutButton from "../../auth/LogoutButton";
import ReactLogoMark from "../../brand/ReactLogoMark";
import { BellIcon, SearchIcon, SunIcon } from "../NavIcons";

export default function NavBar() {
  const { user } = useAuth();
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="home-header fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-brand-800 dark:bg-brand-900/95">
      <div className="home-header-inner mx-auto grid h-16 max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 lg:gap-6">
        <Link to="/" className="flex items-center gap-2">
          <ReactLogoMark size="sm" />
          <span className="hidden font-extrabold text-slate-900 sm:inline dark:text-white">
            React Posts
          </span>
        </Link>

        <label className="relative mx-auto hidden w-full max-w-xl md:block">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search people, posts, inspiration..."
            className="home-search w-full pl-10"
            aria-label="Search"
          />
        </label>

        <HeaderActions
          photo={user?.photo}
          onToggleDark={() => setDark((v) => !v)}
        />
      </div>
    </header>
  );
}

function HeaderActions({
  photo,
  onToggleDark,
}: {
  photo?: string;
  onToggleDark: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-end gap-2 sm:gap-3">
      <button
        type="button"
        onClick={() => navigate("/notifications")}
        className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-brand-800"
        aria-label="Notifications"
      >
        <BellIcon />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>
      <Link to="/profile" className="shrink-0">
        <img
          src={photo}
          alt="Your profile"
          className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-100"
        />
      </Link>
      <LogoutButton layout="header" />
      <button
        type="button"
        onClick={onToggleDark}
        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-brand-800"
        aria-label="Toggle theme"
      >
        <SunIcon />
      </button>
    </div>
  );
}