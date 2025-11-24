import { Search, Settings, Image, Globe, Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AIChat = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
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

        {/* Search Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Ask anything about trading, analyze your portfolio, or log a trade..."
              className="pl-12 pr-36 py-6 text-base rounded-2xl border-2 focus-visible:ring-primary"
            />
            <div className="absolute right-3 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <Globe className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8 rounded-lg">
                <Send className="h-4 w-4" />
              </Button>
            </div>
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
    </div>
  );
};

// Import icons for quick actions
import { TrendingUp, BarChart, Shield } from "lucide-react";
