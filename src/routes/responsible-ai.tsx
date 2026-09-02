import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — WorkAI" },
      {
        name: "description",
        content:
          "How WorkAI handles accuracy, privacy, bias and human oversight, and what users must verify before acting on AI output.",
      },
      { property: "og:title", content: "Responsible AI — WorkAI" },
      {
        property: "og:description",
        content: "Our commitments on accuracy, privacy, bias and human oversight.",
      },
    ],
  }),
  component: ResponsibleAiPage,
});

const SECTIONS = [
  {
    title: "Accuracy and verification",
    body: "AI models can produce confident but incorrect statements. Treat every output as a first draft. Verify names, figures, dates, policies and any factual claim against a trusted source before sending or acting on it.",
  },
  {
    title: "Human oversight",
    body: "WorkAI never sends emails, books time or makes decisions on your behalf. A person reviews and approves every output. Editing is built into each tool for exactly this reason.",
  },
  {
    title: "Privacy and confidentiality",
    body: "Do not paste confidential, personal, financial, medical or client-identifying information into any tool. Your prompts are sent to a third-party AI model for processing. Activity counts and preferences are stored only in your own browser.",
  },
  {
    title: "Bias and fairness",
    body: "Language models reflect biases present in their training data. Review AI-written communication for tone, inclusivity and cultural appropriateness, especially in hiring, performance or client-facing contexts.",
  },
  {
    title: "Appropriate use",
    body: "WorkAI supports drafting, summarizing, planning and exploratory research. It is not a substitute for legal, financial, medical or HR advice, and should not be used to make decisions that materially affect people without expert human review.",
  },
  {
    title: "Transparency",
    body: "Where AI-generated content is shared externally or influences a decision, be open about the fact that AI assisted in producing it.",
  },
];

function ResponsibleAiPage() {
  return (
    <AppLayout>
      <PageHeader
        icon={ShieldCheck}
        title="Responsible AI"
        description="WorkAI is designed to keep a human in the loop. These are the commitments and expectations for using it safely at work."
      />

      <Disclaimer className="mb-4" />

      <div className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((s) => (
          <section key={s.title} className="surface-card p-5">
            <h2 className="font-serif text-lg">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </AppLayout>
  );
}
