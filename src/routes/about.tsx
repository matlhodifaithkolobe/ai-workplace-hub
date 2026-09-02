import { createFileRoute, Link } from "@tanstack/react-router";
import { Info } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { TOOLS } from "@/lib/nav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About WorkAI — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "WorkAI is an AI workplace productivity platform built for the CAPACITI AI Skill Accelerator Programme: email, meetings, planning, research and chat in one dashboard.",
      },
      { property: "og:title", content: "About WorkAI" },
      {
        property: "og:description",
        content: "One connected AI platform for everyday workplace productivity.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppLayout>
      <PageHeader
        icon={Info}
        title="About WorkAI"
        description="Work smarter. Communicate better. Get more done."
      />

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <section className="surface-card space-y-4 p-6">
          <h2 className="font-serif text-xl">What WorkAI is</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            WorkAI is an integrated AI productivity assistant for professionals. Instead of five
            disconnected tools, it brings email writing, meeting summarization, task planning,
            research and a conversational assistant into a single dashboard with one consistent
            workflow: give context, generate, then edit, copy or regenerate.
          </p>
          <h2 className="font-serif text-xl">How it works</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every tool sends a carefully structured prompt to a large language model. Each prompt
            defines a role, the workplace context, your input, the task, explicit rules and a
            required output format — which is why outputs come back consistently structured and
            ready to use.
          </p>
          <h2 className="font-serif text-xl">Built for</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This platform was created as a project for the CAPACITI AI Skill Accelerator Programme,
            demonstrating practical, responsible applications of generative AI in the workplace.
          </p>
        </section>

        <section className="surface-card p-6">
          <h2 className="font-serif text-xl">The five tools</h2>
          <ul className="mt-4 space-y-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <li key={tool.to}>
                  <Link
                    to={tool.to}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3 transition-colors hover:border-primary/40"
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{tool.label}</p>
                      <p className="text-[12px] text-muted-foreground">{tool.blurb}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
