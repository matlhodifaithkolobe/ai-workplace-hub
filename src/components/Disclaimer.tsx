import { ShieldAlert } from "lucide-react";

import { DISCLAIMER } from "@/lib/prompts";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/12 px-4 py-3 ${className}`}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
      <p className="text-[11px] leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );
}
