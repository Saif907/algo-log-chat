import { useState } from "react";
import { Search, Sparkles, Image, Globe, Calendar, Send, TrendingUp, BarChart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const quickActions = [
  { icon: TrendingUp, label: "Log a trade" },
  { icon: BarChart, label: "Analyze portfolio" },
  { icon: Globe, label: "Market insights" },
  { icon: Shield, label: "Risk assessment" },
];

export const AIChat = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");

  const handleQuickAction = (label: string) => {
    setInput(label);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm here to help with your trading! This is a demo response." }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {messages.length === 0 ? (
        // Empty State
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl sm:text-3xl">T</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2">TradeLM</h1>
              <p className="text-base sm:text-xl text-muted-foreground">AI-Powered Trading Intelligence</p>
            </div>
          </div>

          {/* Hero Input */}
          <div className="w-full max-w-3xl px-2">
            <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 bg-muted/30 rounded-full px-3 sm:px-5 py-3 sm:py-4">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask anything about trading..."
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 text-sm sm:text-base"
                  />
                </div>
                <Button 
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                  <Image className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <action.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Active Conversation
        <div className="flex-1 flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-3 sm:py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">T</span>
                </div>
                <span className="font-semibold text-sm sm:text-base">TradeLM Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessages([])}
                className="text-xs sm:text-sm"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 pb-32">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                      <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/30 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Input */}
          <div className="fixed bottom-4 left-0 right-0 z-50 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 sm:gap-3 bg-background/80 backdrop-blur-xl rounded-full border border-border px-3 sm:px-5 py-2.5 sm:py-3 shadow-2xl">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 flex-1 text-sm sm:text-base"
                />
                <Button 
                  size="icon" 
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex-shrink-0"
                  onClick={handleSend}
                >
                  <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
