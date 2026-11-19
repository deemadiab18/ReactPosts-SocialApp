import { NavLink } from "react-router-dom";
import { BellIcon, HomeIcon, UserIcon } from "./NavIcons";

const links = [
  { to: "/", label: "Home", end: true, icon: HomeIcon },
  { to: "/profile", label: "Profile", end: false, icon: UserIcon },
  { to: "/notifications", label: "Notifications", end: false, icon: BellIcon },
];

export default function MobileBottomNav() {
  return (
    <nav className="home-mobile-nav fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden dark:border-brand-800 dark:bg-brand-900/95">
      <ul className="grid grid-cols-3">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-2.5 text-[10px] font-bold ${
                  isActive ? "text-brand-600" : "text-slate-500"
                }`
              }
            >
              <link.icon />
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}