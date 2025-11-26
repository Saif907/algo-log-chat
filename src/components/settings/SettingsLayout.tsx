import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { 
  User, Globe, TrendingUp, BookOpen, Bell, Database, 
  CreditCard, Shield, Palette, Key, HelpCircle, Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

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
  const { collapsed, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <div className={cn(
        "flex",
        !isMobile && (collapsed ? "ml-16" : "ml-60")
      )}>
        {/* Settings Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your workspace</p>
          </div>

          <nav className="space-y-6">
            {settingsSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-muted text-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
        </aside>

        {/* Settings Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
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
