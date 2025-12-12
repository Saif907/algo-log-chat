// frontend/src/App.tsx
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Components
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Eagerly loaded pages (Critical for startup)
import { Auth } from "./pages/Auth";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Lazy Loaded Pages (Performance Optimization)
// Using named exports where applicable
const Dashboard = lazy(() => import("./pages/Dashboard").then(m => ({ default: m.Dashboard })));
const AIChat = lazy(() => import("./pages/AIChat").then(m => ({ default: m.AIChat })));
const Markets = lazy(() => import("./pages/Markets").then(m => ({ default: m.Markets })));
const Trades = lazy(() => import("./pages/Trades").then(m => ({ default: m.Trades })));
const TradeDetail = lazy(() => import("./pages/TradeDetail").then(m => ({ default: m.TradeDetail })));
const Strategies = lazy(() => import("./pages/Strategies").then(m => ({ default: m.Strategies })));
const StrategyDetail = lazy(() => import("./pages/StrategyDetail").then(m => ({ default: m.StrategyDetail })));
const CalendarPage = lazy(() => import("./pages/CalendarPage").then(m => ({ default: m.CalendarPage })));
const Analytics = lazy(() => import("./pages/Analytics").then(m => ({ default: m.Analytics })));

// Lazy Loaded Settings
const Profile = lazy(() => import("./pages/settings/Profile"));
const AccountsBrokers = lazy(() => import("./pages/settings/AccountsBrokers"));
const TradingPreferences = lazy(() => import("./pages/settings/TradingPreferences"));
const JournalSettings = lazy(() => import("./pages/settings/JournalSettings"));
const AISettings = lazy(() => import("./pages/settings/AISettings"));
const Notifications = lazy(() => import("./pages/settings/Notifications"));
const DataImport = lazy(() => import("./pages/settings/DataImport"));
const Billing = lazy(() => import("./pages/settings/Billing"));
const Security = lazy(() => import("./pages/settings/Security"));
const Appearance = lazy(() => import("./pages/settings/Appearance"));
const APIKeys = lazy(() => import("./pages/settings/APIKeys"));
const About = lazy(() => import("./pages/settings/About"));

// Legal pages (Can remain eager or lazy depending on traffic, keeping eager for simplicity if text-heavy/small)
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Refund from "./pages/legal/Refund";
import Cancellation from "./pages/legal/Cancellation";
import Shipping from "./pages/legal/Shipping";
import Cookies from "./pages/legal/Cookies";
import Disclaimer from "./pages/legal/Disclaimer";
import DataProtection from "./pages/legal/DataProtection";
import AcceptableUse from "./pages/legal/AcceptableUse";
import CommunityGuidelines from "./pages/legal/CommunityGuidelines";
import BillingPolicy from "./pages/legal/Billing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading Fallback Component
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Landing Page - Default Route */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
              
                {/* Legal Pages (Public) */}
                <Route path="/legal/privacy" element={<Privacy />} />
                <Route path="/legal/terms" element={<Terms />} />
                <Route path="/legal/refund" element={<Refund />} />
                <Route path="/legal/cancellation" element={<Cancellation />} />
                <Route path="/legal/shipping" element={<Shipping />} />
                <Route path="/legal/cookies" element={<Cookies />} />
                <Route path="/legal/disclaimer" element={<Disclaimer />} />
                <Route path="/legal/data-protection" element={<DataProtection />} />
                <Route path="/legal/acceptable-use" element={<AcceptableUse />} />
                <Route path="/legal/community-guidelines" element={<CommunityGuidelines />} />
                <Route path="/legal/billing-policy" element={<BillingPolicy />} />
                
                {/* Protected Main App Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/markets" element={<ProtectedRoute><Layout><Markets /></Layout></ProtectedRoute>} />
                <Route path="/trades" element={<ProtectedRoute><Layout><Trades /></Layout></ProtectedRoute>} />
                <Route path="/trades/:id" element={<ProtectedRoute><Layout><TradeDetail /></Layout></ProtectedRoute>} />
                <Route path="/strategies" element={<ProtectedRoute><Layout><Strategies /></Layout></ProtectedRoute>} />
                <Route path="/strategies/:id" element={<ProtectedRoute><Layout><StrategyDetail /></Layout></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Layout><CalendarPage /></Layout></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
                
                {/* ✅ Secure AI Chat Route */}
                <Route path="/ai-chat" element={<ProtectedRoute><Layout><AIChat /></Layout></ProtectedRoute>} />
                
                {/* Protected Settings Routes */}
                <Route path="/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/settings/accounts" element={<ProtectedRoute><AccountsBrokers /></ProtectedRoute>} />
                <Route path="/settings/trading" element={<ProtectedRoute><TradingPreferences /></ProtectedRoute>} />
                <Route path="/settings/journal" element={<ProtectedRoute><JournalSettings /></ProtectedRoute>} />
                <Route path="/settings/ai" element={<ProtectedRoute><AISettings /></ProtectedRoute>} />
                <Route path="/settings/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                
                {/* ✅ Renamed for clarity: Data Import/Export */}
                <Route path="/settings/data-import" element={<ProtectedRoute><DataImport /></ProtectedRoute>} />
                
                <Route path="/settings/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                <Route path="/settings/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
                <Route path="/settings/appearance" element={<ProtectedRoute><Appearance /></ProtectedRoute>} />
                <Route path="/settings/api-keys" element={<ProtectedRoute><APIKeys /></ProtectedRoute>} />
                <Route path="/settings/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;