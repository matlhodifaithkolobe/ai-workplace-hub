import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, NotebookPen, ListChecks, Microscope, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { Disclaimer } from "@/components/Disclaimer";
import { TOOLS } from "@/lib/nav";
import { getActivity, getStats, timeAgo, type ActivityItem, type Stats, type ToolKey } from "@/lib/activity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkAI Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "WorkAI brings email drafting, meeting summaries, task planning, research and a workplace chatbot into one AI dashboard.",
      },
      { property: "og:title", content: "WorkAI Dashboard — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter. Communicate better. Get more done with five AI workplace tools.",
      },
    ],
  }),
  component: Dashboard,
});

const ICONS: Record<ToolKey, typeof Mail> = {
  email: Mail,
  meetings: NotebookPen,
  tasks: ListChecks,
  research: Microscope,
  chat: MessagesSquare,
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const sync = () => {
      setStats(getStats());
      setActivity(getActivity());
    };
    sync();
    window.addEventListener("workai:activity", sync);
    return () => window.removeEventListener("workai:activity", sync);
  }, []);

  const cards: Array<{ label: string; value: number; hint: string }> = [
    { label: "Emails drafted", value: stats?.email ?? 0, hint: "Smart Email Generator" },
    { label: "Meetings summarized", value: stats?.meetings ?? 0, hint: "Notes Summarizer" },
    { label: "Plans generated", value: stats?.tasks ?? 0, hint: "AI Task Planner" },
    { label: "Research briefings", value: stats?.research ?? 0, hint: "Research Assistant" },
  ];

  return (
    <AppLayout>
      <section className="relative mb-7 overflow-hidden rounded-3xl px-1 py-4">
        <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-accent/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
            {greeting()}, welcome to WorkAI.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Work smarter. Communicate better. Get more done — five AI tools for your everyday
            workplace tasks, in one connected workspace.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="surface-card p-4">
            <p className="text-[11px] text-muted-foreground">{c.label}</p>
            <p className="mt-1 font-serif text-3xl">{c.value}</p>
            <p className="mt-1 text-[11px] font-medium text-primary">{c.hint}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl">AI Tools</h2>
          <span className="text-[11px] text-muted-foreground">5 ready</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="surface-card group flex items-center gap-4 p-4 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{tool.label}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{tool.blurb}</p>
                </div>
                <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-gradient-to-br from-foreground to-primary/80 p-5 text-background shadow-lg">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent" />
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-70">Recent activity</p>
          </div>
          {activity.length === 0 ? (
            <p className="mt-4 text-sm opacity-70">
              No activity yet. Generate an email, summary, plan or research briefing and it will
              appear here.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {activity.slice(0, 6).map((item) => {
                const Icon = ICONS[item.tool];
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-background/15">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-snug">{item.title}</p>
                      <p className="mt-0.5 text-[11px] opacity-60">
                        {item.detail} · {timeAgo(item.at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Disclaimer />
          <Link
            to="/chat"
            className="surface-card flex items-center gap-3 p-4 transition-colors hover:border-primary/40"
          >
            <MessagesSquare className="size-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Ask the WorkAI chatbot</p>
              <p className="text-[12px] text-muted-foreground">
                Emails, planning, summaries and research — conversationally.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
