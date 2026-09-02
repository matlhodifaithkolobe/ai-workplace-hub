import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { NAV_SECTIONS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className="brand-gradient grid size-9 place-items-center rounded-xl font-serif text-base font-semibold text-primary-foreground">
        W
      </div>
      <div className="leading-none">
        <p className="font-serif text-[16px] font-semibold">WorkAI</p>
        <p className="mt-1 text-[10px] text-muted-foreground">AI Workplace Assistant</p>
      </div>
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-6">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {section.title}
          </p>
          <ul className="mt-2 space-y-1">
            {section.items.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/12 text-primary"
                        : "text-foreground/70 hover:bg-sidebar-accent hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <Brand />
        <div className="mt-8 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <p className="mt-4 px-3 text-[11px] leading-relaxed text-muted-foreground">
          Work smarter. Communicate better. Get more done.
        </p>
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="grid size-9 place-items-center rounded-full border border-border text-foreground/70 lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div className="lg:hidden">
              <Brand />
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <Sparkles className="size-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Work smarter. Communicate better. Get more done.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggle}
                aria-label="Toggle colour theme"
                className="grid size-9 place-items-center rounded-full border border-border bg-card text-foreground/70 transition-colors hover:text-foreground"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              <div className="brand-gradient grid size-9 place-items-center rounded-full text-xs font-semibold text-primary-foreground">
                WA
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
