import { Home, TrendingUp, Layers, BookOpen, Calendar, BarChart3, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const mainNav = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Markets", icon: TrendingUp, url: "/markets" },
  { title: "Trades", icon: Layers, url: "/trades" },
  { title: "Playbooks", icon: BookOpen, url: "/playbooks" },
];

const toolsNav = [
  { title: "Calendar", icon: Calendar, url: "/calendar" },
  { title: "Analytics", icon: BarChart3, url: "/analytics" },
  { title: "AI Chat", icon: MessageSquare, url: "/ai-chat" },
];

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-lg">TradeLM</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Section */}
        <div className="px-3 mb-6">
          {!collapsed && (
            <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </h2>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  collapsed && "justify-center"
                )}
                activeClassName="bg-secondary text-primary"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Tools Section */}
        <div className="px-3">
          {!collapsed && (
            <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tools
            </h2>
          )}
          <nav className="space-y-1">
            {toolsNav.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  collapsed && "justify-center"
                )}
                activeClassName="bg-secondary text-primary"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary-foreground">U</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Trader</p>
              <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
