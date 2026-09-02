import type { ReactNode } from "react";

/** Tiny markdown renderer: headings, bold, bullets, numbered lists and tables. */
function inline(text: string, key: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    const k = `${key}-${i}`;
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={k} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return (
        <em key={k}>{part.slice(1, -1)}</em>
      );
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={k} className="rounded bg-muted px-1 py-0.5 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    return <span key={k}>{part}</span>;
  });
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/```/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let ordered = false;
  let table: string[][] = [];

  const flushList = () => {
    if (!list.length) return;
    const items = list.map((item, i) => (
      <li key={i} className="leading-relaxed">
        {inline(item, `li-${i}`)}
      </li>
    ));
    blocks.push(
      ordered ? (
        <ol key={`l${blocks.length}`} className="ml-5 list-decimal space-y-1.5 text-sm">
          {items}
        </ol>
      ) : (
        <ul key={`l${blocks.length}`} className="ml-5 list-disc space-y-1.5 text-sm">
          {items}
        </ul>
      ),
    );
    list = [];
  };

  const flushTable = () => {
    if (!table.length) return;
    const [head = [], ...rows] = table;
    blocks.push(
      <div key={`t${blocks.length}`} className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/70">
            <tr>
              {head.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold">
                  {inline(h, `th${i}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-t border-border">
                {r.map((c, ci) => (
                  <td key={ci} className="px-3 py-2 align-top">
                    {inline(c, `td${ri}${ci}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    table = [];
  };

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      const cells = trimmed.slice(1, -1).split("|").map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return;
      table.push(cells);
      return;
    }
    flushTable();

    if (!trimmed) {
      flushList();
      return;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushList();
      const level = (heading[1] ?? "#").length;
      blocks.push(
        <p
          key={`h${index}`}
          className={
            level <= 2
              ? "font-serif text-lg font-semibold text-foreground"
              : "text-sm font-semibold uppercase tracking-wide text-muted-foreground"
          }
        >
          {inline(heading[2] ?? "", `h${index}`)}
        </p>,
      );
      return;
    }
    const bullet = /^[-*•]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      if (ordered) flushList();
      ordered = false;
      list.push(bullet[1] ?? "");
      return;
    }
    const num = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (num) {
      if (!ordered) flushList();
      ordered = true;
      list.push(num[1] ?? "");
      return;
    }
    flushList();
    blocks.push(
      <p key={`p${index}`} className="text-sm leading-relaxed">
        {inline(trimmed, `p${index}`)}
      </p>,
    );
  });

  flushList();
  flushTable();

  return <div className="space-y-3">{blocks}</div>;
}
