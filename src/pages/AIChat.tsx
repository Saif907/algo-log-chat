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
    
    // Simulate AI response
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
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">T</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold mb-2">TradeLM</h1>
              <p className="text-xl text-muted-foreground">AI-Powered Trading Intelligence</p>
            </div>
          </div>

          {/* Hero Input */}
          <div className="w-full max-w-3xl">
            <div className="bg-background/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1 bg-muted/30 rounded-full px-5 py-4">
                  <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask anything about trading, analyze your portfolio, or log a trade..."
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 text-base"
                  />
                </div>
                <Button 
                  size="icon"
                  className="h-12 w-12 rounded-full flex-shrink-0"
                  onClick={handleSend}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3 px-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Sparkles className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Globe className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Calendar className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button 
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="lg"
                  className="gap-2 rounded-full"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Active Conversation
        <div className="flex-1 flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="font-semibold">TradeLM Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessages([])}
              >
                Clear Chat
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/30 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Input */}
          <div className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
            <div className="max-w-4xl mx-auto px-6 w-[90%] md:w-[65%]">
              <div className="pointer-events-auto">
                <div className="flex items-center gap-3 bg-background/80 backdrop-blur-xl rounded-full border border-border px-5 py-3 shadow-2xl">
                  <Sparkles className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask anything..."
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 flex-1"
                  />
                  <Button 
                    size="icon" 
                    className="h-9 w-9 rounded-full flex-shrink-0"
                    onClick={handleSend}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground/60 text-center mt-2">
                  AI can make mistakes. Check important info.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
