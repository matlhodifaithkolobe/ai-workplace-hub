import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, Wand2 } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { useAi } from "@/components/useAi";
import { MEETING_PROMPT } from "@/lib/prompts";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkAI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into a summary with key points, decisions, action items, responsible persons and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkAI" },
      {
        property: "og:description",
        content: "Extract decisions, owners and deadlines from any meeting notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");
  const ai = useAi("meetings");

  const submit = () => {
    if (!notes.trim()) return;
    void ai.generate({
      systemPrompt: MEETING_PROMPT,
      userPrompt: `Meeting title: ${title || "Not specified"}\n\nRaw notes:\n${notes.trim()}`,
      activity: [`Summarized "${title || "meeting notes"}"`, "Key points & action items"],
    });
  };

  return (
    <AppLayout>
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. WorkAI extracts key points, decisions, action items, responsible persons and deadlines."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="font-serif text-lg">Meeting input</h2>

          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Meeting title (optional)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Weekly product sync"
            className="mt-2 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />

          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Notes or transcript
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your raw meeting notes here — bullet points, half sentences and typos are fine."
            className="mt-2 min-h-[320px] w-full resize-y rounded-2xl border border-border bg-background p-3.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />

          <button
            onClick={submit}
            disabled={ai.loading || !notes.trim()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Wand2 className="size-4" />
            {ai.loading ? "Summarizing…" : "Summarize meeting"}
          </button>
        </section>

        <AiOutput
          title="Meeting summary"
          value={ai.output}
          onChange={ai.setOutput}
          loading={ai.loading}
          error={ai.error}
          onRegenerate={ai.regenerate}
          onClear={ai.clear}
          emptyHint="Paste your notes on the left. Your structured summary with action items will appear here."
        />
      </div>
    </AppLayout>
  );
}
