import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Moon, Sun, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { useTheme } from "@/components/theme";
import { clearActivity, getStats, type Stats } from "@/lib/activity";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkAI" },
      {
        name: "description",
        content: "Manage your WorkAI appearance, default tone preferences and local activity history.",
      },
      { property: "og:title", content: "Settings — WorkAI" },
      { property: "og:description", content: "Appearance, defaults and data controls for WorkAI." },
    ],
  }),
  component: SettingsPage,
});

const KEY = "workai.prefs.v1";

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [name, setName] = useState("");
  const [tone, setTone] = useState("Professional");
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(getStats());
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string; tone?: string };
        setName(parsed.name ?? "");
        setTone(parsed.tone ?? "Professional");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const save = () => {
    window.localStorage.setItem(KEY, JSON.stringify({ name, tone }));
    toast.success("Preferences saved");
  };

  const total = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0;

  return (
    <AppLayout>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Personalise WorkAI, switch between light and dark mode and manage the activity stored on this device."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="font-serif text-lg">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            WorkAI supports a warm light theme and a low-glare dark theme.
          </p>
          <button
            onClick={toggle}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </button>
        </section>

        <section className="surface-card p-5">
          <h2 className="font-serif text-lg">Preferences</h2>
          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Your name (used in email sign-offs)
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Amara Ndlovu"
            className="mt-2 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Default email tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none"
          >
            {["Formal", "Friendly", "Professional", "Persuasive", "Apologetic"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={save}
            className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Save preferences
          </button>
        </section>

        <section className="surface-card p-5">
          <h2 className="font-serif text-lg">Your data</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            WorkAI stores your activity counts and preferences in this browser only — nothing is
            sent anywhere except your prompts to the AI model.
          </p>
          <p className="mt-3 text-sm">
            <span className="font-serif text-2xl">{total}</span>{" "}
            <span className="text-muted-foreground">AI generations recorded on this device</span>
          </p>
          <button
            onClick={() => {
              clearActivity();
              setStats(getStats());
              toast.success("Activity history cleared");
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2.5 text-sm font-medium text-destructive"
          >
            <Trash2 className="size-4" />
            Clear activity history
          </button>
        </section>

        <Disclaimer />
      </div>
    </AppLayout>
  );
}
