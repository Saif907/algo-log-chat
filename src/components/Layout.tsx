import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface LayoutProps {
  children: ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const { isMobile, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-20 flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 ml-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold text-lg">TradeLM</span>
          </div>
        </header>
      )}

      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-h-screen",
          !isMobile && "ml-16",
          isMobile && "mt-16"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};
