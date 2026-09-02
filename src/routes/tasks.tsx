import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { useAi } from "@/components/useAi";
import { PLANNER_PROMPT } from "@/lib/prompts";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkAI" },
      {
        name: "description",
        content:
          "Enter tasks with priority, deadline and duration and let WorkAI build a realistic prioritized daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner — WorkAI" },
      {
        property: "og:description",
        content: "Turn a task list into a realistic, prioritized schedule.",
      },
    ],
  }),
  component: TasksPage,
});

type Task = {
  id: string;
  name: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
  duration: string;
};

const newTask = (): Task => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: "",
  priority: "Medium",
  deadline: "",
  duration: "1h",
});

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([newTask()]);
  const [horizon, setHorizon] = useState<"Daily" | "Weekly">("Daily");
  const [hours, setHours] = useState("08:30 – 17:00, one hour lunch");
  const ai = useAi("tasks");

  const update = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const filled = tasks.filter((t) => t.name.trim());

  const submit = () => {
    if (!filled.length) return;
    const list = filled
      .map(
        (t, i) =>
          `${i + 1}. ${t.name.trim()} — priority: ${t.priority}, deadline: ${
            t.deadline || "not specified"
          }, estimated duration: ${t.duration || "not specified"}`,
      )
      .join("\n");
    void ai.generate({
      systemPrompt: PLANNER_PROMPT,
      userPrompt: `Planning horizon: ${horizon}\nAvailable working hours: ${hours}\n\nTasks:\n${list}`,
      activity: [`Planned a ${filled.length}-task ${horizon.toLowerCase()} schedule`, horizon],
    });
  };

  return (
    <AppLayout>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Add your tasks with priority, deadline and duration. WorkAI builds a realistic prioritized schedule you can actually follow."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="surface-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg">Your tasks</h2>
            <div className="flex gap-1.5">
              {(["Daily", "Weekly"] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${
                    horizon === h
                      ? "border-primary bg-primary/12 text-primary"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={task.name}
                    onChange={(e) => update(task.id, { name: e.target.value })}
                    placeholder="Task description"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                  <button
                    onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                    aria-label="Remove task"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <select
                    value={task.priority}
                    onChange={(e) => update(task.id, { priority: e.target.value as Task["priority"] })}
                    className="rounded-xl border border-border bg-card px-2 py-2 text-xs outline-none"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <input
                    type="date"
                    value={task.deadline}
                    onChange={(e) => update(task.id, { deadline: e.target.value })}
                    className="rounded-xl border border-border bg-card px-2 py-2 text-xs outline-none"
                  />
                  <input
                    value={task.duration}
                    onChange={(e) => update(task.id, { duration: e.target.value })}
                    placeholder="1h 30m"
                    className="rounded-xl border border-border bg-card px-2 py-2 text-xs outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setTasks((prev) => [...prev, newTask()])}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Add task
          </button>

          <label className="mt-5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Available working hours
          </label>
          <input
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />

          <button
            onClick={submit}
            disabled={ai.loading || !filled.length}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <Wand2 className="size-4" />
            {ai.loading ? "Planning…" : `Build ${horizon.toLowerCase()} plan`}
          </button>
        </section>

        <AiOutput
          title="Your schedule"
          value={ai.output}
          onChange={ai.setOutput}
          loading={ai.loading}
          error={ai.error}
          onRegenerate={ai.regenerate}
          onClear={ai.clear}
          emptyHint="Add at least one task on the left, then build your plan. The schedule appears here."
        />
      </div>
    </AppLayout>
  );
}
