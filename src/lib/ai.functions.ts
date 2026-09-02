import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const AiInput = z.object({
  systemPrompt: z.string().min(1),
  messages: z.array(MessageSchema).min(1),
});

export type AiMessage = z.infer<typeof MessageSchema>;

async function callGateway(systemPrompt: string, messages: AiMessage[]) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new Error("AI is not configured yet. Please try again later.");
  }

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) {
      throw new Error("The AI is busy right now. Please wait a moment and try again.");
    }
    if (res.status === 402 || res.status === 403) {
      throw new Error(
        "AI usage is currently unavailable for this workspace. Please check your AI credits or workspace settings.",
      );
    }
    throw new Error(
      `The AI request failed (${res.status}). ${detail.slice(0, 180) || "Please try again."}`,
    );
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

export const generateAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AiInput.parse(input))
  .handler(async ({ data }) => {
    const text = await callGateway(data.systemPrompt, data.messages);
    return { text };
  });
