// src/components/Header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Ensure AuthContext is imported
import { UserProfileDropdown } from "@/components/UserProfileDropdown"; // Reuse your existing dropdown

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              {/* Replace text with a professional icon/logo */}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-5 h-5 text-white"
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">TradeOmen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Demo", "Pricing", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              // Logged In State
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/dashboard")}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
                {/* Reuse existing profile dropdown for consistency */}
                <div className="h-8 w-8">
                   <UserProfileDropdown collapsed={true} /> 
                </div>
              </div>
            ) : (
              // Guest State
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="font-medium hover:bg-muted/50">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="font-semibold shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
             {user && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/dashboard")}
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Button>
             )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border absolute w-full animate-in slide-in-from-top-5">
          <div className="px-4 py-6 space-y-4">
            {["Features", "Demo", "Pricing", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-lg font-medium text-foreground/80 hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              {user ? (
                 <Button className="w-full justify-center" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                 </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full justify-center" onClick={() => navigate("/auth")}>
                    Log In
                  </Button>
                  <Button className="w-full justify-center" onClick={() => navigate("/auth")}>
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};