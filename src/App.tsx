import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { AIChat } from "./pages/AIChat";
import { Markets } from "./pages/Markets";
import { Trades } from "./pages/Trades";
import { TradeDetail } from "./pages/TradeDetail";
import { Strategies } from "./pages/Strategies";
import { StrategyDetail } from "./pages/StrategyDetail";
import { CalendarPage } from "./pages/CalendarPage";
import { Analytics } from "./pages/Analytics";
import NotFound from "./pages/NotFound";

// Settings pages
import Profile from "./pages/settings/Profile";
import AccountsBrokers from "./pages/settings/AccountsBrokers";
import TradingPreferences from "./pages/settings/TradingPreferences";
import JournalSettings from "./pages/settings/JournalSettings";
import AISettings from "./pages/settings/AISettings";
import Notifications from "./pages/settings/Notifications";
import DataImport from "./pages/settings/DataImport";
import Billing from "./pages/settings/Billing";
import Security from "./pages/settings/Security";
import Appearance from "./pages/settings/Appearance";
import APIKeys from "./pages/settings/APIKeys";
import About from "./pages/settings/About";

// Legal pages
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
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
              <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
              <Route path="/markets" element={<ProtectedRoute><Layout><Markets /></Layout></ProtectedRoute>} />
              <Route path="/trades" element={<ProtectedRoute><Layout><Trades /></Layout></ProtectedRoute>} />
              <Route path="/trades/:id" element={<ProtectedRoute><Layout><TradeDetail /></Layout></ProtectedRoute>} />
              <Route path="/strategies" element={<ProtectedRoute><Layout><Strategies /></Layout></ProtectedRoute>} />
              <Route path="/strategies/:id" element={<ProtectedRoute><Layout><StrategyDetail /></Layout></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><Layout><CalendarPage /></Layout></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
              <Route path="/ai-chat" element={<ProtectedRoute><Layout><AIChat /></Layout></ProtectedRoute>} />
              
              {/* Protected Settings Routes */}
              <Route path="/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings/accounts" element={<ProtectedRoute><AccountsBrokers /></ProtectedRoute>} />
              <Route path="/settings/trading" element={<ProtectedRoute><TradingPreferences /></ProtectedRoute>} />
              <Route path="/settings/journal" element={<ProtectedRoute><JournalSettings /></ProtectedRoute>} />
              <Route path="/settings/ai" element={<ProtectedRoute><AISettings /></ProtectedRoute>} />
              <Route path="/settings/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/settings/data" element={<ProtectedRoute><DataImport /></ProtectedRoute>} />
              <Route path="/settings/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/settings/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
              <Route path="/settings/appearance" element={<ProtectedRoute><Appearance /></ProtectedRoute>} />
              <Route path="/settings/api-keys" element={<ProtectedRoute><APIKeys /></ProtectedRoute>} />
              <Route path="/settings/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
