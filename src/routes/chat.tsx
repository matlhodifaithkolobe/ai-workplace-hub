import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessagesSquare, RotateCcw, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { Markdown } from "@/lib/markdown";
import { generateAi, type AiMessage } from "@/lib/ai.functions";
import { CHAT_PROMPT } from "@/lib/prompts";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — WorkAI" },
      {
        name: "description",
        content:
          "Chat with WorkAI for help with emails, planning, summarizing, research and everyday workplace productivity.",
      },
      { property: "og:title", content: "AI Workplace Chatbot — WorkAI" },
      {
        property: "og:description",
        content: "A conversational assistant for workplace productivity.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Help me decline a meeting politely",
  "How do I prioritise 12 tasks in one day?",
  "Summarise this update for my manager",
  "Draft a project status email",
];

function ChatPage() {
  const run = useServerFn(generateAi);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: AiMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { systemPrompt: CHAT_PROMPT, messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
      logActivity("chat", "Chatted with the WorkAI assistant", content.slice(0, 60));
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "We couldn't reach the AI service. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        icon={MessagesSquare}
        title="AI Workplace Chatbot"
        description="Ask anything about emails, planning, summarizing, research or workplace productivity. The assistant remembers this conversation."
      />

      <div className="surface-card flex h-[calc(100vh-19rem)] min-h-[460px] flex-col p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="text-sm font-semibold">WorkAI Assistant</p>
          <button
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Clear chat
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 && !loading ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <MessagesSquare className="mx-auto size-6 text-accent" />
                <p className="mt-3 text-sm font-medium">How can I help you work smarter today?</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background"
                }`}
              >
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                ) : (
                  <Markdown text={m.content} />
                )}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              WorkAI is thinking…
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <p className="font-semibold text-destructive">Something went wrong</p>
              <p className="mt-1 text-muted-foreground">{error}</p>
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 border-t border-border px-4 py-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder="Ask WorkAI anything…"
            className="max-h-32 min-h-[48px] w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-50"
          >
            <SendHorizonal className="size-4" />
          </button>
        </form>
      </div>

      <Disclaimer className="mt-4" />
    </AppLayout>
  );
}
