import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/workouts", label: "Workouts", end: true },
  { to: "/exercises", label: "Exercises", end: true },
  { to: "/workouts/new", label: "Create Workout" },
  { to: "/settings", label: "Settings" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-secondary text-white shadow"
      : "text-purple-100 hover:bg-white/20 hover:text-white"
  }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-brand-secondary text-white"
      : "text-purple-100 hover:bg-white/20 hover:text-white"
  }`;

export default function NavHeader() {
  return (
    <Disclosure as="header" className="border-b border-purple-400/40 bg-brand-primary">
      {({ open, close }) => (
        <>
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-3 py-4 sm:px-4">
            <NavLink to="/" className="text-lg font-bold text-white">
              LockIn Workouts
            </NavLink>

            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-2 md:flex">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} className={linkClass} end={link.end}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <DisclosureButton
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white transition hover:bg-white/25 md:hidden"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              >
                {open ? (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      d="M4 7h16M4 12h16M4 17h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </DisclosureButton>
            </div>
          </div>

          <DisclosurePanel className="border-t border-white/15 px-3 pb-4 pt-3 sm:px-4 md:hidden">
            <nav className="grid gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={mobileLinkClass}
                  end={link.end}
                  onClick={() => close()}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
