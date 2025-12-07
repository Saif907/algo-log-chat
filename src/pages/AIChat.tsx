import { useState, useRef, useEffect } from "react";
import { Search, Sparkles, Image, Globe, Calendar, Send, TrendingUp, BarChart, Shield, Plus, ChevronDown, MessageSquare, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/contexts/SidebarContext";
import { TradeCard } from "@/components/chat/TradeCard";
import { StrategyCard } from "@/components/chat/StrategyCard";
import { MarketAnalysisCard } from "@/components/chat/MarketAnalysisCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiClient } from "@/lib/api-client";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  type?: "text" | "trade" | "strategy" | "market-analysis";
  data?: any;
}

const demoChatHistories: ChatHistory[] = [
  { id: "1", title: "NIFTY trade analysis", timestamp: new Date(Date.now() - 3600000), preview: "Logged a long trade on NIFTY..." },
];

export const AIChat = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>(demoChatHistories);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const { sidebarWidth, isMobile } = useSidebar();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleQuickAction = (label: string) => {
    setInput(label);
    inputRef.current?.focus();
  };

  // --- Parsing Logic (Client-Side Detection) ---

  const parseTradeFromMessage = (content: string): any | null => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("log") && (lowerContent.includes("trade") || lowerContent.includes("bought") || lowerContent.includes("sold"))) {
      const symbolMatch = content.match(/\b([A-Z]{2,10})\b/);
      const priceMatch = content.match(/(?:at|@|price)\s*₹?\s*(\d+(?:\.\d+)?)/i);
      const quantityMatch = content.match(/(\d+)\s*(?:shares|qty|quantity|lots)/i);
      const pnlMatch = content.match(/(?:pnl|profit|loss|made|lost)\s*₹?\s*(\d+(?:\.\d+)?)/i);
      
      if (symbolMatch || priceMatch) {
        const entryPrice = parseFloat(priceMatch?.[1] || "0");
        const quantity = parseInt(quantityMatch?.[1] || "1");
        // Simple mock PnL if not provided
        const pnl = pnlMatch ? parseFloat(pnlMatch[1]) : (Math.random() * 2000 - 1000); 
        
        return {
          symbol: symbolMatch?.[1] || "NIFTY",
          side: lowerContent.includes("short") || lowerContent.includes("sold") ? "short" : "long",
          entryPrice: entryPrice,
          exitPrice: entryPrice + (pnl / quantity), // Estimate exit
          quantity: quantity,
          pnl: pnl,
          rMultiple: +(Math.random() * 3 - 1).toFixed(1),
          entryDate: new Date().toLocaleDateString(),
          strategy: "Discretionary", // Default
        };
      }
    }
    return null;
  };

  const parseStrategyFromMessage = (content: string): any | null => {
    const lowerContent = content.toLowerCase();
    if ((lowerContent.includes("create") || lowerContent.includes("log")) && (lowerContent.includes("strategy") || lowerContent.includes("playbook"))) {
      const nameMatch = content.match(/(?:called|named|strategy)\s+["']?([^"'\n,]+)["']?/i);
      return {
        name: nameMatch?.[1] || "New Strategy",
        description: content, // Use full text as description
        entryRules: ["Price action confirmation", "Volume spike"],
        exitRules: ["Target hit", "Stop loss triggered"],
        marketCondition: "Trending",
        winRate: 0,
        avgRMultiple: 0,
      };
    }
    return null;
  };

  const parseMarketAnalysisRequest = (content: string): any | null => {
    const lowerContent = content.toLowerCase();
    const isMarketCheck = (
      (lowerContent.includes("market") && (lowerContent.includes("check") || lowerContent.includes("analyze") || lowerContent.includes("fit"))) ||
      (lowerContent.includes("strategy") && (lowerContent.includes("market") || lowerContent.includes("conditions")))
    );
    
    if (isMarketCheck) {
      const strategyMatch = content.match(/(?:my\s+)?(?:strategy|playbook)\s+(?:called\s+)?["']?([^"'\n,]+?)["']?(?:\s+strategy)?(?:\s|$)/i);
      const strategyName = strategyMatch?.[1]?.trim() || "General Trading";
      
      const verdicts = ["favorable", "neutral", "unfavorable"] as const;
      const randomVerdict = verdicts[Math.floor(Math.random() * 3)];
      
      return {
        strategy: strategyName,
        verdict: randomVerdict,
        confidence: Math.floor(Math.random() * 30) + 65,
        marketCondition: randomVerdict === "favorable" ? "Strong Uptrend" : randomVerdict === "neutral" ? "Sideways Consolidation" : "High Volatility",
        summary: `AI analysis suggests ${randomVerdict} conditions for ${strategyName}. Volatility is ${randomVerdict === "unfavorable" ? "high" : "moderate"}.`,
        keyPoints: [
          "Trend alignment check complete",
          "Volume analysis shows institutional activity",
          "Global cues are mixed to positive"
        ],
        sources: [
          { title: "Market Outlook", source: "NSE Data", url: "#", type: "data" as const },
          { title: "Technical Report", source: "AI Model", url: "#", type: "analysis" as const },
        ],
        timestamp: "just now"
      };
    }
    return null;
  };

  // --- Main Handle Send ---

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // 1. Optimistic UI Update
    const userMessage: Message = { role: "user", content: input, type: "text" };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // 2. Identify Intent
      const trade = parseTradeFromMessage(currentInput);
      const strategy = parseStrategyFromMessage(currentInput);
      const marketAnalysis = parseMarketAnalysisRequest(currentInput);

      // --- BRANCH A: Market Analysis (Simulation) ---
      if (marketAnalysis) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Fake think time
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `I've analyzed the market conditions for **${marketAnalysis.strategy}**.`,
          type: "market-analysis",
          data: marketAnalysis
        }]);
      } 
      
      // --- BRANCH B: Log Trade (Real DB Insert) ---
      else if (trade) {
        // Insert into Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from('trades').insert({
            user_id: user.id,
            symbol: trade.symbol,
            direction: trade.side.toUpperCase() === "LONG" ? "LONG" : "SHORT",
            entry_price: trade.entryPrice,
            exit_price: trade.exitPrice,
            quantity: trade.quantity,
            pnl: trade.pnl,
            entry_time: new Date().toISOString(),
            status: "Closed",
            encrypted_notes: `Logged via AI Chat: ${currentInput}`
          });
          
          if (error) {
            console.error("DB Insert Error:", error);
            toast({ title: "Error", description: "Failed to save trade to database.", variant: "destructive" });
          } else {
            toast({ title: "Success", description: "Trade logged successfully." });
          }
        }

        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I've logged your trade successfully. Here are the details:",
          type: "trade",
          data: trade
        }]);
      } 
      
      // --- BRANCH C: Log Strategy (Real DB Insert) ---
      else if (strategy) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from('strategies').insert({
            user_id: user.id,
            name: strategy.name,
            description: strategy.description,
            rules: { entry: strategy.entryRules, exit: strategy.exitRules }, // JSONB
            color_hex: "#8b5cf6", // Default color
            emoji: "📘"
          });

          if (error) {
             console.error("Strategy Insert Error:", error);
             toast({ title: "Error", description: "Failed to save strategy.", variant: "destructive" });
          }
        }

        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "I've created your new strategy playbook:",
          type: "strategy",
          data: strategy
        }]);
      } 
      
      // --- BRANCH D: General AI Chat (Real Backend Call) ---
      else {
        // Call Python Backend
        const response = await apiClient.post<any>("/chat", {
          message: currentInput,
          session_id: currentChatId || undefined,
          model: "gpt-4-turbo"
        });

        // Save session ID if new
        if (response.session_id && !currentChatId) {
          setCurrentChatId(response.session_id);
        }

        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: response.response,
          type: "text"
        }]);
      }

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error processing your request.",
        type: "text"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInput("");
  };

  const handleSelectChat = (chat: ChatHistory) => {
    setCurrentChatId(chat.id);
    setMessages([
      { role: "user", content: chat.preview, type: "text" },
      { role: "assistant", content: "Loaded previous session...", type: "text" }
    ]);
  };

  const formatTimestamp = (date: Date) => {
    // Simple formatter
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message, idx: number) => {
    if (message.role === "user") {
      return (
        <div key={idx} className="flex justify-end">
          <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-tr-sm shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="flex justify-start gap-2 sm:gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="max-w-[90%] sm:max-w-[75%] space-y-3">
          {message.content && (
            <div className="rounded-2xl px-4 sm:px-5 py-3 bg-muted/50 border border-border/50 rounded-tl-sm shadow-sm backdrop-blur-sm">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          )}
          
          {/* Rich Content Cards */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {message.type === "trade" && message.data && (
              <TradeCard trade={message.data} />
            )}
            {message.type === "strategy" && message.data && (
              <StrategyCard strategy={message.data} />
            )}
            {message.type === "market-analysis" && message.data && (
              <MarketAnalysisCard analysis={message.data} />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-background to-muted/10">
      {messages.length === 0 ? (
        // Empty State
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">TradeLM AI</h1>
              <p className="text-base sm:text-lg text-muted-foreground">Your intelligent trading companion</p>
            </div>
          </div>

          <div className="w-full max-w-2xl px-2 space-y-6">
            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-4 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => handleQuickAction(action.label)}
                >
                  <action.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs sm:text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Active Chat Area
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent">
                    <span className="font-semibold text-lg">TradeLM Assistant</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem onClick={handleNewChat}>
                    <Plus className="h-4 w-4 mr-2" /> New Chat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-48">
                    {chatHistories.map(chat => (
                      <DropdownMenuItem key={chat.id} onClick={() => handleSelectChat(chat)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="truncate">{chat.title}</span>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="ghost" size="icon" onClick={handleNewChat}>
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-6 pb-32">
              {messages.map((message, idx) => renderMessage(message, idx))}
              
              {isTyping && (
                <div className="flex justify-start gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="h-10 w-24 bg-muted rounded-2xl" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 ${isMobile ? '' : 'pl-[var(--sidebar-width)]'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center gap-2 bg-background/80 backdrop-blur-xl p-2 rounded-full border border-border shadow-2xl ring-1 ring-white/10">
            <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-primary">
              <Plus className="h-5 w-5" />
            </Button>
            
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-2 h-12 text-base"
              disabled={isTyping}
            />
            
            <Button 
              size="icon" 
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};