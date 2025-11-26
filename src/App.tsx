import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { Dashboard } from "./pages/Dashboard";
import { AIChat } from "./pages/AIChat";
import { Markets } from "./pages/Markets";
import { Trades } from "./pages/Trades";
import { Strategies } from "./pages/Strategies";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main App Routes */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/markets" element={<Layout><Markets /></Layout>} />
            <Route path="/trades" element={<Layout><Trades /></Layout>} />
            <Route path="/strategies" element={<Layout><Strategies /></Layout>} />
            <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
            <Route path="/ai-chat" element={<Layout><AIChat /></Layout>} />
            
            {/* Settings Routes (No Layout wrapper - SettingsLayout handles it) */}
            <Route path="/settings" element={<Profile />} />
            <Route path="/settings/profile" element={<Profile />} />
            <Route path="/settings/accounts" element={<AccountsBrokers />} />
            <Route path="/settings/trading" element={<TradingPreferences />} />
            <Route path="/settings/journal" element={<JournalSettings />} />
            <Route path="/settings/ai" element={<AISettings />} />
            <Route path="/settings/notifications" element={<Notifications />} />
            <Route path="/settings/data" element={<DataImport />} />
            <Route path="/settings/billing" element={<Billing />} />
            <Route path="/settings/security" element={<Security />} />
            <Route path="/settings/appearance" element={<Appearance />} />
            <Route path="/settings/api-keys" element={<APIKeys />} />
            <Route path="/settings/about" element={<About />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
