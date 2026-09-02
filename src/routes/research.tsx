import { createFileRoute } from "@tanstack/react-router";
import { Microscope, Wand2 } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { useAi } from "@/components/useAi";
import { RESEARCH_PROMPT } from "@/lib/prompts";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkAI" },
      {
        name: "description",
        content:
          "Enter a topic and question to get a clear summary, key findings, workplace applications and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant — WorkAI" },
      {
        property: "og:description",
        content: "Decision-ready workplace research briefings in seconds.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick overview", "Balanced brief", "In-depth analysis"] as const;

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [depth, setDepth] = useState<string>("Balanced brief");
  const ai = useAi("research");

  const submit = () => {
    if (!topic.trim() || !question.trim()) return;
    void ai.generate({
      systemPrompt: RESEARCH_PROMPT,
      userPrompt: `Topic: ${topic.trim()}\nQuestion: ${question.trim()}\nDepth requested: ${depth}`,
      activity: [`Researched "${topic.trim()}"`, depth],
    });
  };

  return (
    <AppLayout>
      <PageHeader
        icon={Microscope}
        title="AI Research Assistant"
        description="Ask a workplace research question. WorkAI returns a summary, key findings, workplace applications and recommendations."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="font-serif text-lg">Research request</h2>

          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Topic
          </label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Hybrid work policies in South African tech companies"
            className="mt-2 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />

          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Your question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What does the evidence say about productivity when teams move to three office days a week?"
            className="mt-2 min-h-[160px] w-full resize-y rounded-2xl border border-border bg-background p-3.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Depth
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DEPTHS.map((d) => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  depth === d
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={submit}
            disabled={ai.loading || !topic.trim() || !question.trim()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Wand2 className="size-4" />
            {ai.loading ? "Researching…" : "Run research"}
          </button>
        </section>

        <AiOutput
          title="Research briefing"
          value={ai.output}
          onChange={ai.setOutput}
          loading={ai.loading}
          error={ai.error}
          onRegenerate={ai.regenerate}
          onClear={ai.clear}
          emptyHint="Add a topic and question on the left to get findings, applications and recommendations."
        />
      </div>
    </AppLayout>
  );
}
