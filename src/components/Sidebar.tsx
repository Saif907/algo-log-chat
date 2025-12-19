import { useState } from "react";
import { Home, TrendingUp, Layers, BookOpen, Calendar, BarChart3, MessageSquare, X, PanelLeftClose, PanelLeft, Lock } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useModal } from "@/contexts/ModalContext";
// Note: Removed unused 'supabase' import since we use 'api' now

// ✅ 1. Import React Query & API
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

const mainNav = [
  { title: "Home", icon: Home, url: "/dashboard" },
  // { title: "Markets", icon: TrendingUp, url: "/markets" },
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
  
  const { user, plan } = useAuth(); // ✅ Use global plan from AuthContext
  const { openUpgradeModal } = useModal();
  
  // ✅ 2. Initialize Query Client
  const queryClient = useQueryClient();

  const isExpanded = isMobile ? mobileOpen : !collapsed;
  
  // ✅ 3. Prefetch Logic (The "Background Loading" Magic)
  const prefetchRoute = (url: string) => {
    // 1. Trades: Fetch Page 1 silently
    if (url === "/trades") {
      queryClient.prefetchQuery({
        queryKey: ["trades", 1, 20, ""], // Must match the key in useTrades hook!
        queryFn: () => api.trades.getAll(1, 20, ""),
        staleTime: 1000 * 60 * 5, // Keep fresh for 5 mins
      });
    } 
    // 2. Strategies: Fetch All silently
    else if (url === "/strategies") {
      queryClient.prefetchQuery({
        queryKey: ["strategies"],
        queryFn: () => api.strategies.getAll(),
        staleTime: 1000 * 60 * 10,
      });
    }
    // 3. ✅ AI Chat: Fetch Session List silently
    // This makes the "History" sidebar appear instantly
    else if (url === "/ai-chat") {
      queryClient.prefetchQuery({
        queryKey: ["chat-sessions"],
        queryFn: () => api.ai.getSessions(),
        staleTime: 1000 * 60 * 5,
      });
    }
  };

  const userPlan = plan.toUpperCase();
  const isFeatureLocked = (url: string) => {
    if (userPlan === "PRO" || userPlan === "FOUNDER") return false;
    const lockedRoutes = ["/analytics", "/ai-chat"];
    return lockedRoutes.includes(url);
  };

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
      onClick={(e) => {
        if (!isExpanded && !isMobile && e.target === e.currentTarget) {
          toggleSidebar();
        }
      }}
    >
      {/* Header with Toggle */}
      <div className="h-16 flex items-center px-3 border-b border-border">
        {!isExpanded && !isMobile && (
          <div 
            className="h-10 w-10 mx-auto flex items-center justify-center transition-all duration-200"
            onClick={(e) => {
               e.stopPropagation();
               toggleSidebar();
            }}
          >
            {sidebarHovered ? (
              <PanelLeft className="h-5 w-5 transition-all duration-200" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center transition-all duration-200">
                <span className="text-white font-bold text-sm">T</span>
              </div>
            )}
          </div>
        )}
        
        {isExpanded && !isMobile && (
          <>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-lg whitespace-nowrap">TradeOmen</span>
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
        
        {isMobile && mobileOpen && (
          <>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-lg whitespace-nowrap">TradeOmen</span>
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
        <div className="px-3 mb-6">
          {isExpanded && (
            <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </h2>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <div 
                key={item.url}
                // ✅ 4. Trigger Background Load on Hover
                onMouseEnter={() => prefetchRoute(item.url)}
              >
                <NavLink
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
              </div>
            ))}
          </nav>
        </div>

        <div className="px-3">
          {isExpanded && (
            <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tools
            </h2>
          )}
          <nav className="space-y-1">
            {toolsNav.map((item) => {
              const isLocked = isFeatureLocked(item.url);

              if (isLocked) {
                return (
                  <button
                    key={item.url}
                    onClick={() => openUpgradeModal(`Upgrade to PRO to access ${item.title}`)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group",
                      "hover:bg-secondary/50 text-muted-foreground hover:text-foreground", 
                      !isExpanded && "justify-center"
                    )}
                  >
                    <div className="relative">
                       <item.icon className="h-5 w-5 flex-shrink-0" />
                    </div>

                    {isExpanded && (
                      <div className="flex flex-1 items-center justify-between">
                        <span>{item.title}</span>
                        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                           <Lock className="h-3 w-3" /> PRO
                        </div>
                      </div>
                    )}
                  </button>
                );
              }

              return (
                <div key={item.url} onMouseEnter={() => prefetchRoute(item.url)}>
                  <NavLink
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
                </div>
              );
            })}
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