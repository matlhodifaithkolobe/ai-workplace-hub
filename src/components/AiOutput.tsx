import { Copy, Check, Pencil, RefreshCw, Trash2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Markdown } from "@/lib/markdown";
import { Disclaimer } from "@/components/Disclaimer";

export function AiOutput({
  title,
  value,
  onChange,
  loading,
  error,
  onRegenerate,
  onClear,
  emptyHint,
}: {
  title: string;
  value: string;
  onChange: (next: string) => void;
  loading: boolean;
  error: string | null;
  onRegenerate: () => void;
  onClear: () => void;
  emptyHint: string;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Couldn't copy — please select the text and copy manually.");
    }
  };

  const hasContent = value.trim().length > 0;

  return (
    <section className="surface-card flex min-h-[420px] flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-lg">{title}</h2>
        <div className="flex flex-wrap items-center gap-1.5">
          <ToolbarButton onClick={copy} disabled={!hasContent} icon={copied ? Check : Copy}>
            {copied ? "Copied" : "Copy"}
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setEditing((e) => !e)}
            disabled={!hasContent}
            icon={Pencil}
            active={editing}
          >
            {editing ? "Done" : "Edit"}
          </ToolbarButton>
          <ToolbarButton onClick={onRegenerate} disabled={loading} icon={RefreshCw}>
            Regenerate
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              onClear();
              setEditing(false);
            }}
            disabled={!hasContent && !error}
            icon={Trash2}
          >
            Clear
          </ToolbarButton>
        </div>
      </div>

      <div className="mt-4 flex-1">
        {loading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-primary" />
              WorkAI is writing…
            </div>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded-full bg-muted"
                style={{ width: `${95 - i * 9}%`, animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
            <p className="text-sm font-semibold text-destructive">Something went wrong</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={onRegenerate}
              className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Try again
            </button>
          </div>
        ) : hasContent ? (
          editing ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-[420px] w-full resize-y rounded-2xl border border-border bg-background p-4 font-mono text-[13px] leading-relaxed outline-none focus:ring-2 focus:ring-ring/40"
            />
          ) : (
            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <Markdown text={value} />
            </div>
          )
        ) : (
          <div className="grid h-full min-h-[240px] place-items-center rounded-2xl border border-dashed border-border px-6 text-center">
            <div>
              <Sparkles className="mx-auto size-6 text-accent" />
              <p className="mt-3 text-sm font-medium">Nothing here yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
            </div>
          </div>
        )}
      </div>

      <Disclaimer className="mt-5" />
    </section>
  );
}

function ToolbarButton({
  onClick,
  disabled,
  icon: Icon,
  active,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: typeof Copy;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-medium transition-colors disabled:opacity-40 ${
        active ? "bg-primary/12 text-primary" : "bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="size-3.5" />
      {children}
    </button>
  );
}
