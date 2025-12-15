import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { 
  User, Globe, TrendingUp, BookOpen, Bell, Database, 
  CreditCard, Shield, Palette, Key, HelpCircle, Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar, SidebarProvider } from "@/contexts/SidebarContext";
import { Sidebar } from "../Sidebar";

interface SettingsLayoutProps {
  children: ReactNode;
}

const settingsSections = [
  {
    title: "MAIN",
    items: [
      { icon: User, label: "Profile", path: "/settings/profile" },
      { icon: Globe, label: "Accounts & Brokers", path: "/settings/accounts" },
      { icon: TrendingUp, label: "Trading Preferences", path: "/settings/trading" },
      { icon: BookOpen, label: "Journal Settings", path: "/settings/journal" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { icon: Bot, label: "AI Settings", path: "/settings/ai" },
      { icon: Bell, label: "Notifications", path: "/settings/notifications" },
      { icon: Database, label: "Data & Import", path: "/settings/data-import" },
      { icon: CreditCard, label: "Billing & Subscription", path: "/settings/billing" },
      { icon: Shield, label: "Security", path: "/settings/security" },
      { icon: Palette, label: "Appearance", path: "/settings/appearance" },
    ],
  },
  {
    title: "ADVANCED",
    items: [
      { icon: Key, label: "API Keys", path: "/settings/api-keys" },
      { icon: HelpCircle, label: "About & Support", path: "/settings/about" },
    ],
  },
];

const SettingsLayoutContent = ({ children }: SettingsLayoutProps) => {
  const { collapsed, isMobile, mobileOpen, setMobileOpen } = useSidebar();

  // Calculate margins based on sidebar states
  const leftPosition = collapsed ? "left-16" : "left-60";
  const mainMargin = collapsed ? "ml-80" : "ml-[31rem]"; 

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setMobileOpen(false)} />
      )}

      {/* Settings Sidebar - Desktop */}
      {!isMobile && (
        <aside className={cn(
          "fixed top-0 z-30 h-screen border-r border-border/60 bg-muted/30 backdrop-blur-xl",
          "w-64 transition-all duration-300 ease-in-out", 
          leftPosition
        )}>
          <div className="h-full overflow-y-auto p-6 scrollbar-none">
            <div className="mb-8 px-2">
              <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage your workspace preferences</p>
            </div>
            
            <nav className="space-y-8">
              {settingsSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-muted-foreground/70 mb-3 px-3 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavLink 
                        key={item.path} 
                        to={item.path} 
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200", 
                          isActive 
                            ? "bg-primary/10 text-primary shadow-sm" 
                            : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                        )}
                      >
                        {/* ✅ FIXED: Using Function-as-Child pattern to access isActive */}
                        {({ isActive }) => (
                          <>
                            <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                            <span>{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>
      )}

      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300 ease-in-out", 
        !isMobile && mainMargin,
        isMobile && "mt-16 w-full"
      )}>
        <div className="max-w-5xl mx-auto p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isMobile && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Settings</h2>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <SidebarProvider>
      <SettingsLayoutContent>{children}</SettingsLayoutContent>
    </SidebarProvider>
  );
};