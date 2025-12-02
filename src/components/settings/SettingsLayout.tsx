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
  const { isMobile, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Main Sidebar */}
      <Sidebar />
      
      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Settings Sidebar */}
      <aside className={cn(
        "fixed top-0 z-30 h-screen border-r border-border bg-card transition-all duration-300 ease-in-out",
        "w-64",
        !isMobile && "left-16",
        isMobile && "left-0 mt-16"
      )}>
        <div className="h-full overflow-y-auto p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your workspace</p>
          </div>

          <nav className="space-y-6">
            {settingsSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-secondary text-primary"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Settings Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        !isMobile && "ml-80",
        isMobile && "ml-64 mt-16"
      )}>
        <div className="p-8">
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
