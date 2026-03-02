import { Disclosure, Switch } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import { useThemeStore } from "../lib/themeStore";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/workouts", label: "Workouts", end: true },
  { to: "/workouts/new", label: "Create Workout" },
  { to: "/settings", label: "Settings" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-secondary text-white shadow"
      : "text-purple-100 hover:bg-white/20 hover:text-white"
  }`;

export default function NavHeader() {
  const isDark = useThemeStore((state) => state.theme === "dark");
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <Disclosure as="header" className="border-b border-purple-400/40 bg-brand-primary">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <NavLink to="/" className="text-lg font-bold text-white">
          LockIn Workouts
        </NavLink>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white">
            <span>{isDark ? "Dark" : "Light"}</span>
            <Switch
              checked={isDark}
              onChange={(next) => setTheme(next ? "dark" : "light")}
              className={`${isDark ? "bg-brand-secondary" : "bg-purple-200"} relative inline-flex h-6 w-11 items-center rounded-full transition`}
            >
              <span
                className={`${isDark ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
