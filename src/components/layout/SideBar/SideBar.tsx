import { Button } from "@heroui/react";
import { NavLink, Link } from "react-router-dom";
import LogoutButton from "../../auth/LogoutButton";
import { BellIcon, HomeIcon, UserIcon } from "../NavIcons";

const links = [
  { to: "/", label: "Home", end: true, icon: HomeIcon },
  { to: "/profile", label: "Profile", end: false, icon: UserIcon },
  { to: "/notifications", label: "Notifications", end: false, icon: BellIcon },
];

export default function SideBar() {
  return (
    <aside className="home-sidebar hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white/80 lg:px-4 lg:py-6 dark:lg:border-brand-800 dark:lg:bg-brand-900/80">
      <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
        Your space
      </p>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                isActive
                  ? "bg-brand-gradient text-white shadow-sm"
                  : "text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-brand-800"
              }`
            }
          >
            <link.icon />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <Link to={{ pathname: "/", hash: "create-post" }} className="mt-6 block">
        <Button fullWidth className="bg-brand-gradient font-bold text-white shadow-sm">
          + Create post
        </Button>
      </Link>

      <LogoutButton layout="sidebar" />

      <div className="home-sidebar-promo mt-auto rounded-2xl border border-brand-100 bg-brand-50 p-4 dark:border-brand-700 dark:bg-brand-800/40">
        <p className="text-sm font-extrabold text-brand-700 dark:text-brand-200">
          Good devs. Great conversations.
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          A little corner of the internet that feels like your React community.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 px-1 text-[10px] font-semibold text-slate-400">
        <Link to="/" className="hover:text-brand-600">
          About
        </Link>
        <Link to="/" className="hover:text-brand-600">
          Privacy
        </Link>
        <Link to="/" className="hover:text-brand-600">
          Terms
        </Link>
      </div>
    </aside>
  );
}