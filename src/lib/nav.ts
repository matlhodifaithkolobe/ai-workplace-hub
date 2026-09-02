import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Microscope,
  MessagesSquare,
  Settings,
  Info,
  ShieldCheck,
} from "lucide-react";

export const TOOLS = [
  {
    to: "/email",
    label: "Email Generator",
    blurb: "Draft in 5 tones",
    icon: Mail,
  },
  {
    to: "/meetings",
    label: "Meeting Summarizer",
    blurb: "Auto action items",
    icon: NotebookPen,
  },
  {
    to: "/tasks",
    label: "AI Task Planner",
    blurb: "Realistic schedule",
    icon: ListChecks,
  },
  {
    to: "/research",
    label: "Research Assistant",
    blurb: "Findings + advice",
    icon: Microscope,
  },
  {
    to: "/chat",
    label: "Workplace Chatbot",
    blurb: "Ask anything",
    icon: MessagesSquare,
  },
] as const;

export const NAV_SECTIONS = [
  {
    title: "Workspace",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "AI Tools",
    items: TOOLS.map(({ to, label, icon }) => ({ to, label, icon })),
  },
  {
    title: "More",
    items: [
      { to: "/settings", label: "Settings", icon: Settings },
      { to: "/about", label: "About", icon: Info },
      { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
    ],
  },
] as const;
