import { useState } from "react";
import { Home, TrendingUp, Layers, BookOpen, Calendar, BarChart3, MessageSquare, X, PanelLeftClose, PanelLeft } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { UserProfileDropdown } from "./UserProfileDropdown";

const mainNav = [
  { title: "Home", icon: Home, url: "/dashboard" },
  { title: "Markets", icon: TrendingUp, url: "/markets" },
  { title: "Trades", icon: Layers, url: "/trades" },
  { title: "Strategies", icon: BookOpen, url: "/strategies" },
];

const toolsNav = [
  { title: "Calendar", icon: Calendar, url: "/calendar" },
  { title: "Analytics", icon: BarChart3, url: "/analytics" },
  { title: "AI Chat", icon: MessageSquare, url: "/ai-chat" },
];

export const Sidebar = () => {
  const { collapsed, toggleSidebar, isMobile, mobileOpen, setMobileOpen } = useSidebar();
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const isExpanded = isMobile ? mobileOpen : !collapsed;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
        isExpanded ? "w-60" : "w-16",
        isMobile && !mobileOpen && "-translate-x-full",
        isMobile && "z-50",
        !isExpanded && !isMobile && "cursor-pointer"
      )}
      onMouseEnter={() => !isExpanded && !isMobile && setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
      onClick={() => {
        if (!isExpanded && !isMobile) {
          toggleSidebar();
        }
      }}
    >
      {/* Header with Toggle - ChatGPT Style */}
      <div className="h-16 flex items-center px-3 border-b border-border">
        {/* Collapsed state: Logo that transforms to toggle on hover - clicking anywhere opens sidebar */}
        {!isExpanded && !isMobile && (
          <div className="h-10 w-10 mx-auto flex items-center justify-center transition-all duration-200">
            {sidebarHovered ? (
              <PanelLeft className="h-5 w-5 transition-all duration-200" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center transition-all duration-200">
                <span className="text-white font-bold text-sm">T</span>
              </div>
            )}
          </div>
        )}
        
        {/* Expanded state: Logo + Title + Toggle on right */}
        {isExpanded && !isMobile && (
          <>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-lg whitespace-nowrap">TradeLM</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-9 w-9 flex-shrink-0"
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          </>
        )}
        
        {/* Mobile expanded state */}
        {isMobile && mobileOpen && (
          <>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-lg whitespace-nowrap">TradeLM</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Section */}
        <div className="px-3 mb-6">
          {isExpanded && (
            <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </h2>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === "/dashboard"}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  !isExpanded && "justify-center"
                )}
                activeClassName="bg-secondary text-primary"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span>{item.title}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Tools Section */}
        <div className="px-3">
          {isExpanded && (
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
                  !isExpanded && "justify-center"
                )}
                activeClassName="bg-secondary text-primary"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span>{item.title}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <UserProfileDropdown collapsed={!isExpanded} />
      </div>
    </aside>
  );
};
