import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-border bg-card/70 px-5 py-6 sm:px-7">
      <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <div className="brand-gradient grid size-11 shrink-0 place-items-center rounded-2xl text-primary-foreground">
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="font-serif text-2xl leading-tight sm:text-3xl">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
