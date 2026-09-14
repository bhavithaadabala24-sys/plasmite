import {
  BookOpen,
  Bug,
  Calculator,
  CircleHelp,
  FlaskConical,
  FolderKanban,
  Home,
  Lightbulb,
  NotebookText,
  RefreshCw,
  Search,
  Settings,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  key: string;
  label?: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    key: "home",
    label: "Home",
    items: [{ title: "Home", href: "/dashboard", icon: Home }],
  },
  {
    key: "library",
    label: "Library",
    items: [
      { title: "Notes", href: "/notes", icon: NotebookText },
      { title: "Subjects", href: "/subjects", icon: BookOpen },
      { title: "Labs", href: "/labs", icon: FlaskConical },
      { title: "Projects", href: "/projects", icon: FolderKanban },
    ],
  },
  {
    key: "learning",
    label: "Learning",
    items: [
      { title: "Questions", href: "/questions", icon: CircleHelp },
      { title: "Revision", href: "/revision", icon: RefreshCw },
      { title: "Viva", href: "/viva", icon: CircleHelp },
    ],
  },
  {
    key: "personal",
    label: "Personal",
    items: [
      { title: "Ideas", href: "/ideas", icon: Lightbulb },
      { title: "Bugs", href: "/bugs", icon: Bug },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    items: [
      { title: "Calculator", href: "/tools/calculator", icon: Calculator },
      { title: "Developer Tools", href: "/tools/developer", icon: Wrench },
    ],
  },
  {
    key: "account",
    label: "Account",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
      { title: "Profile", href: "/profile", icon: UserRound },
    ],
  },
];

export const mobileNav: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Notes", href: "/notes", icon: NotebookText },
  { title: "Subjects", href: "/subjects", icon: BookOpen },
  { title: "Search", href: "/search", icon: Search },
];