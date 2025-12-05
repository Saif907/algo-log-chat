import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, Image, Globe, Calendar, Send, TrendingUp, BarChart, Shield, Plus, ChevronDown, MessageSquare, Clock, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/contexts/SidebarContext";
import { TradeCard } from "@/components/chat/TradeCard";
import { StrategyCard } from "@/components/chat/StrategyCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const quickActions = [
  { icon: TrendingUp, label: "Log a trade" },
  { icon: BarChart, label: "Analyze my performance" },
  { icon: Globe, label: "Plan my next trade" },
  { icon: Shield, label: "Log a strategy" },
];

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "trade" | "strategy";
  data?: any;
}

// Demo chat histories
const demoChatHistories: ChatHistory[] = [
  { id: "1", title: "NIFTY trade analysis", timestamp: new Date(Date.now() - 3600000), preview: "Logged a long trade on NIFTY..." },
  { id: "2", title: "Risk management review", timestamp: new Date(Date.now() - 86400000), preview: "Analyzed my position sizing..." },
  { id: "3", title: "Breakout strategy", timestamp: new Date(Date.now() - 172800000), preview: "Created a new breakout strategy..." },
];

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>(demoChatHistories);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { sidebarWidth, isMobile } = useSidebar();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (label: string) => {
    setInput(label);
    inputRef.current?.focus();
  };

  const parseTradeFromMessage = (content: string): any | null => {
    // Simple parsing logic - in production this would be AI-powered
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("log") && (lowerContent.includes("trade") || lowerContent.includes("bought") || lowerContent.includes("sold"))) {
      // Extract potential trade details
      const symbolMatch = content.match(/\b([A-Z]{2,10})\b/);
      const priceMatch = content.match(/(?:at|@|price)\s*₹?\s*(\d+(?:\.\d+)?)/i);
      const quantityMatch = content.match(/(\d+)\s*(?:shares|qty|quantity|lots)/i);
      const pnlMatch = content.match(/(?:pnl|profit|loss|made|lost)\s*₹?\s*(\d+(?:\.\d+)?)/i);
      
      if (symbolMatch || priceMatch) {
        return {
          symbol: symbolMatch?.[1] || "NIFTY",
          side: lowerContent.includes("short") || lowerContent.includes("sold") ? "short" : "long",
          entryPrice: parseFloat(priceMatch?.[1] || "24500"),
          exitPrice: parseFloat(priceMatch?.[1] || "24500") + (Math.random() * 200 - 100),
          quantity: parseInt(quantityMatch?.[1] || "50"),
          pnl: parseFloat(pnlMatch?.[1] || String(Math.floor(Math.random() * 5000 - 2000))),
          rMultiple: +(Math.random() * 3 - 1).toFixed(1),
          entryDate: new Date().toLocaleDateString(),
          strategy: "Breakout",
        };
      }
    }
    return null;
  };

  const parseStrategyFromMessage = (content: string): any | null => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("strategy") || lowerContent.includes("playbook")) {
      const nameMatch = content.match(/(?:called|named|strategy)\s+["']?([^"'\n,]+)["']?/i);
      return {
        name: nameMatch?.[1] || "New Strategy",
        description: "AI-parsed strategy from your description",
        entryRules: ["Price breaks above resistance", "Volume confirmation"],
        exitRules: ["Target 2R profit", "Stop loss at 1R"],
        marketCondition: "Trending",
        winRate: 65,
        avgRMultiple: 1.5,
      };
    }
    return null;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: "user", content: input, type: "text" };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput("");
    
    // Check if message contains trade or strategy to log
    const trade = parseTradeFromMessage(currentInput);
    const strategy = parseStrategyFromMessage(currentInput);

    setTimeout(() => {
      if (trade) {
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: "I've logged your trade. Here are the details:",
            type: "trade",
            data: trade
          }
        ]);
      } else if (strategy) {
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: "I've created your strategy. Here's what I captured:",
            type: "strategy",
            data: strategy
          }
        ]);
      } else if (currentInput.toLowerCase().includes("performance") || currentInput.toLowerCase().includes("analyze")) {
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: "Based on your recent trades, here's your performance summary:\n\n📊 **This Week**\n- Total P&L: ₹12,450\n- Win Rate: 68%\n- Avg R-Multiple: 1.4R\n- Best Trade: NIFTY (+₹4,200)\n\n💡 **Insights**\n- Your breakout strategy is performing well\n- Consider reducing position size on volatile days\n- Morning trades show better win rate than afternoon",
            type: "text"
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: "I'm here to help! You can:\n\n• **Log trades** - Just tell me about your trade in plain English\n• **Log strategies** - Describe your trading strategy and I'll save it\n• **Analyze performance** - Ask me about your trading stats\n• **Plan trades** - Get insights for your next trade",
            type: "text"
          }
        ]);
      }
    }, 800);

    // Update current chat or create new one
    if (!currentChatId) {
      const newChat: ChatHistory = {
        id: Date.now().toString(),
        title: currentInput.slice(0, 30) + (currentInput.length > 30 ? "..." : ""),
        timestamp: new Date(),
        preview: currentInput,
      };
      setChatHistories(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInput("");
  };

  const handleSelectChat = (chat: ChatHistory) => {
    // In production, this would load messages from storage
    setCurrentChatId(chat.id);
    setMessages([
      { role: "user", content: chat.preview, type: "text" },
      { role: "assistant", content: "This is a demo of loading previous chat. In production, this would restore your full conversation.", type: "text" }
    ]);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderMessage = (message: Message, idx: number) => {
    if (message.role === "user") {
      return (
        <div key={idx} className="flex justify-end">
          <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-tr-sm">
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="flex justify-start gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
        </div>
        <div className="max-w-[85%] sm:max-w-[70%] space-y-3">
          <div className="rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 bg-muted/30 rounded-tl-sm">
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          {message.type === "trade" && message.data && (
            <TradeCard trade={message.data} />
          )}
          {message.type === "strategy" && message.data && (
            <StrategyCard strategy={message.data} />
          )}
        </div>
      </div>
    );
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
              <p className="text-base sm:text-xl text-muted-foreground">Log trades, analyze performance, plan smarter</p>
            </div>
          </div>

          {/* Hero Input */}
          <div className="w-full max-w-3xl px-2">
            <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 bg-muted/30 rounded-full px-3 sm:px-5 py-3 sm:py-4">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Tell me about your trade or ask anything..."
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
              {/* Left: Logo + Chat Selector */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">T</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1 px-2 h-8 sm:h-9">
                      <span className="font-semibold text-sm sm:text-base max-w-[120px] sm:max-w-[200px] truncate">
                        TradeLM Assistant
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 sm:w-80 bg-background border border-border">
                    <div className="px-2 py-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 h-9"
                        onClick={handleNewChat}
                      >
                        <Plus className="h-4 w-4" />
                        New Chat
                      </Button>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1">
                      <p className="text-xs text-muted-foreground font-medium px-2 py-1">Recent Chats</p>
                    </div>
                    <ScrollArea className="h-[200px] sm:h-[250px]">
                      {chatHistories.map((chat) => (
                        <DropdownMenuItem
                          key={chat.id}
                          className="flex items-start gap-3 px-3 py-2.5 cursor-pointer focus:bg-muted/50"
                          onClick={() => handleSelectChat(chat)}
                        >
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{chat.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{chat.preview}</p>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatTimestamp(chat.timestamp)}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNewChat}
                  className="text-xs sm:text-sm gap-1 h-8 sm:h-9"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">New</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMessages([])}
                  className="h-8 w-8 sm:h-9 sm:w-9"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 pb-32">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {messages.map((message, idx) => renderMessage(message, idx))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Floating Input - Aligned to sidebar */}
          <div 
            className="fixed bottom-4 z-50 px-4"
            style={{
              left: isMobile ? 16 : sidebarWidth + 16,
              right: 16,
              transition: "left 0.3s ease"
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 sm:gap-3 bg-background/95 backdrop-blur-xl rounded-full border border-border px-3 sm:px-5 py-2.5 sm:py-3 shadow-2xl">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <Input
                  ref={inputRef}
                  placeholder="Log a trade, ask about performance..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 flex-1 text-sm sm:text-base"
                />
                <Button 
                  size="icon" 
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex-shrink-0"
                  onClick={handleSend}
                  disabled={!input.trim()}
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
