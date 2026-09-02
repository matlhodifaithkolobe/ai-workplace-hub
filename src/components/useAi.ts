import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";

import { generateAi } from "@/lib/ai.functions";
import { logActivity, type ToolKey } from "@/lib/activity";

export function useAi(tool: ToolKey) {
  const run = useServerFn(generateAi);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const last = useRef<{ systemPrompt: string; userPrompt: string; activity?: [string, string] } | null>(
    null,
  );

  const generate = useCallback(
    async (args: { systemPrompt: string; userPrompt: string; activity?: [string, string] }) => {
      last.current = args;
      setLoading(true);
      setError(null);
      try {
        const res = await run({
          data: {
            systemPrompt: args.systemPrompt,
            messages: [{ role: "user" as const, content: args.userPrompt }],
          },
        });
        setOutput(res.text);
        if (args.activity) logActivity(tool, args.activity[0], args.activity[1]);
      } catch (e) {
        setError(
          e instanceof Error && e.message
            ? e.message
            : "We couldn't reach the AI service. Please check your connection and try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [run, tool],
  );

  const regenerate = useCallback(() => {
    if (last.current) void generate(last.current);
    else setError("Fill in the form above first, then press Generate.");
  }, [generate]);

  const clear = useCallback(() => {
    setOutput("");
    setError(null);
  }, []);

  return { output, setOutput, loading, error, generate, regenerate, clear };
}
