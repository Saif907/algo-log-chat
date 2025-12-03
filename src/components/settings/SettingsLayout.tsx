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
      { icon: Database, label: "Data & Import", path: "/settings/data" },
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

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Settings Sidebar - Desktop */}
      {!isMobile && (
        <aside className={cn(
          "fixed top-0 z-30 h-screen border-r border-border bg-card",
          "w-56 lg:w-64",
          collapsed ? "left-16" : "left-60"
        )}>
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">Settings</h2>
              <p className="text-xs text-muted-foreground">Manage workspace</p>
            </div>
            <nav className="space-y-4">
              {settingsSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-[10px] font-semibold text-muted-foreground mb-2 px-2 uppercase">{section.title}</h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavLink key={item.path} to={item.path} className={({ isActive }) => cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary/50"
                      )}>
                        <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{item.label}</span>
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
        "flex-1 transition-all duration-300",
        !isMobile && (collapsed ? "ml-72 lg:ml-80" : "ml-[29rem] lg:ml-[31rem]"),
        isMobile && "mt-14"
      )}>
        <div className="p-4 sm:p-6 lg:p-8">
          {isMobile && (
            <div className="mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
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
