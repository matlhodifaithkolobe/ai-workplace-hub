const KEY = "workai.activity.v1";
const STATS_KEY = "workai.stats.v1";

export type ToolKey = "email" | "meetings" | "tasks" | "research" | "chat";

export type ActivityItem = {
  id: string;
  tool: ToolKey;
  title: string;
  detail: string;
  at: number;
};

export type Stats = Record<ToolKey, number>;

const EMPTY_STATS: Stats = { email: 0, meetings: 0, tasks: 0, research: 0, chat: 0 };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getActivity(): ActivityItem[] {
  return read<ActivityItem[]>(KEY, []);
}

export function getStats(): Stats {
  return { ...EMPTY_STATS, ...read<Partial<Stats>>(STATS_KEY, {}) };
}

export function logActivity(tool: ToolKey, title: string, detail: string) {
  if (typeof window === "undefined") return;
  const items = getActivity();
  const next: ActivityItem[] = [
    { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, tool, title, detail, at: Date.now() },
    ...items,
  ].slice(0, 20);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  const stats = getStats();
  stats[tool] = (stats[tool] ?? 0) + 1;
  window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  window.dispatchEvent(new Event("workai:activity"));
}

export function clearActivity() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(STATS_KEY);
  window.dispatchEvent(new Event("workai:activity"));
}

export function timeAgo(at: number) {
  const mins = Math.round((Date.now() - at) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
}
