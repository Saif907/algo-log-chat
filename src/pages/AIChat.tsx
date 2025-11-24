import { Search, Settings, Image, Globe, Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatInput } from "@/components/ChatInput";

export const AIChat = () => {
  return (
    <div className="min-h-screen pb-24 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-2">TradeLM</h1>
            <p className="text-xl text-muted-foreground">AI-Powered Trading Intelligence</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button variant="outline" size="lg" className="gap-2 rounded-xl">
            <TrendingUp className="h-4 w-4" />
            Log a trade
          </Button>
          <Button variant="outline" size="lg" className="gap-2 rounded-xl">
            <BarChart className="h-4 w-4" />
            Analyze portfolio
          </Button>
          <Button variant="outline" size="lg" className="gap-2 rounded-xl">
            <Globe className="h-4 w-4" />
            Market insights
          </Button>
          <Button variant="outline" size="lg" className="gap-2 rounded-xl">
            <Shield className="h-4 w-4" />
            Risk assessment
          </Button>
        </div>
      </div>
      
      <ChatInput placeholder="Ask anything about trading, analyze your portfolio, or log a trade..." />
    </div>
  );
};

// Import icons for quick actions
import { TrendingUp, BarChart, Shield } from "lucide-react";
