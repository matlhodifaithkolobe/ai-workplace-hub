import { createFileRoute } from "@tanstack/react-router";
import { Mail, Wand2 } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { useAi } from "@/components/useAi";
import { emailPrompt } from "@/lib/prompts";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkAI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails in Formal, Friendly, Professional, Persuasive or Apologetic tones, then edit, copy and regenerate.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkAI" },
      {
        property: "og:description",
        content: "Draft workplace email in five tones and refine it in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Professional", "Persuasive", "Apologetic"] as const;
const LENGTHS = ["Short", "Medium", "Detailed"] as const;

function EmailPage() {
  const [brief, setBrief] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<string>("Professional");
  const [length, setLength] = useState<string>("Medium");
  const ai = useAi("email");

  const submit = () => {
    if (!brief.trim()) return;
    void ai.generate({
      systemPrompt: emailPrompt(tone, recipient, length),
      userPrompt: `Email request: ${brief.trim()}`,
      activity: [`Drafted a ${tone.toLowerCase()} email`, `Tone: ${tone}`],
    });
  };

  return (
    <AppLayout>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the email you need. WorkAI writes it in the tone you choose — then you can edit, copy or regenerate it."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-5">
          <h2 className="font-serif text-lg">Your brief</h2>

          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            What is the email about?
          </label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="e.g. Follow up with Dana on the Q3 pricing proposal, remind her the deadline is Friday and offer a call."
            className="mt-2 min-h-[140px] w-full resize-y rounded-2xl border border-border bg-background p-3.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />

          <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Recipient (optional)
          </label>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Dana, Head of Procurement"
            className="mt-2 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Tone
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  tone === t
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Length
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LENGTHS.map((l) => (
              <button
                key={l}
                onClick={() => setLength(l)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  length === l
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={submit}
            disabled={ai.loading || !brief.trim()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
          >
            <Wand2 className="size-4" />
            {ai.loading ? "Generating…" : "Generate email"}
          </button>
        </section>

        <AiOutput
          title="Draft email"
          value={ai.output}
          onChange={ai.setOutput}
          loading={ai.loading}
          error={ai.error}
          onRegenerate={ai.regenerate}
          onClear={ai.clear}
          emptyHint="Describe your email on the left and press Generate. Your draft appears here, fully editable."
        />
      </div>
    </AppLayout>
  );
}
