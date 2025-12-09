// frontend/src/pages/AIChat.tsx
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Send, Sparkles, Globe, TrendingUp, BarChart, Shield, 
  Plus, ChevronDown, MessageSquare, Trash2, Loader2, User, Paperclip 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/contexts/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ImportMappingCard } from "@/components/chat/ImportMappingCard";
import { TradeConfirmationCard } from "@/components/chat/TradeConfirmationCard";
import { TradeCard } from "@/components/trades/TradeCard"; // ✅ Import TradeCard
import { supabase } from "@/integrations/supabase/client";

// --- Types ---
interface OptimisticMessage {
  id?: string; // Added ID for reliable updates
  role: "user" | "assistant";
  content: string;
  isOptimistic?: boolean;
  type?: "text" | "import-confirmation" | "trade-confirmation" | "trade-receipt"; // ✅ Added trade-receipt
  data?: any;
  created_at?: string;
}

const quickActions = [
  { icon: TrendingUp, label: "Log a trade" },
  { icon: BarChart, label: "Analyze my performance" },
  { icon: Globe, label: "Plan my next trade" },
  { icon: Shield, label: "Log a strategy" },
];

export const AIChat = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    return localStorage.getItem("tradeLm_activeSessionId");
  });
  const [input, setInput] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync Session
  useEffect(() => {
    if (currentSessionId) localStorage.setItem("tradeLm_activeSessionId", currentSessionId);
    else localStorage.removeItem("tradeLm_activeSessionId");
  }, [currentSessionId]);

  // Queries
  const { data: sessions = [] } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => apiClient.getSessions(),
  });

  const { data: history = [], isError: isHistoryError } = useQuery({
    queryKey: ['chat-history', currentSessionId],
    queryFn: () => currentSessionId ? apiClient.getSessionHistory(currentSessionId) : Promise.resolve([]),
    enabled: !!currentSessionId,
    retry: 1,
  });

  useEffect(() => {
    if (isHistoryError) {
      handleNewChat();
      toast({ title: "Session not found", description: "Starting a new chat.", variant: "destructive" });
    }
  }, [isHistoryError]);

  // ✅ NEW HANDLER: Transition from Draft -> Receipt
  const handleTradeComplete = (savedTradeData: any) => {
    setOptimisticMessages(prev => prev.map(msg => {
      if (msg.type === "trade-confirmation") {
        return { 
          ...msg, 
          type: "trade-receipt", 
          data: savedTradeData,
          content: "Trade successfully logged." // Fallback text
        };
      }
      return msg;
    }));
    // Refresh lists
    queryClient.invalidateQueries({ queryKey: ['trades'] });
  };

  // --- Mutation: Send Text ---
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      return apiClient.sendMessage(text, currentSessionId || undefined);
    },
    onMutate: async (text) => {
      const userMsg: OptimisticMessage = { 
        id: Math.random().toString(), // Temp ID
        role: "user", 
        content: text, 
        isOptimistic: true 
      };
      setOptimisticMessages(prev => [...prev, userMsg]);
      setInput(""); 
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 10);
    },
    onSuccess: (data, variables) => {
      const targetSessionId = data.session_id;
      
      const userMsg = { 
        role: "user", 
        content: variables, 
        created_at: new Date().toISOString() 
      };

      if (data.tool_call) {
        const toolMsg: OptimisticMessage = {
           id: "tool-" + Math.random(),
           role: "assistant",
           content: data.response,
           type: data.tool_call.type, // "trade-confirmation"
           data: data.tool_call.data
        };
        
        // Save User Msg to History Cache
        queryClient.setQueryData(['chat-history', targetSessionId], (oldData: any[] | undefined) => {
          return [...(oldData || []), userMsg];
        });

        // Show Tool Message in Optimistic (replaces the temp user msg)
        setOptimisticMessages([toolMsg]);
      } 
      else {
        const aiMsg = { role: "assistant", content: data.response, created_at: new Date().toISOString() };

        queryClient.setQueryData(['chat-history', targetSessionId], (oldData: any[] | undefined) => {
          return [...(oldData || []), userMsg, aiMsg];
        });
        
        setOptimisticMessages([]); 
      }

      if (!currentSessionId) {
        setCurrentSessionId(data.session_id);
        queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      }
    },
    onError: () => {
      setOptimisticMessages([]);
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  });

  // --- Mutation: Upload File ---
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, text }: { file: File, text: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("message", text);
      formData.append("session_id", currentSessionId || ""); 
      
      const { data: { session } } = await supabase.auth.getSession();
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
      
      const res = await fetch(`${API_URL}/chat/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${session?.access_token}` },
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onMutate: ({ file, text }) => {
      const userMsg: OptimisticMessage = { role: "user", content: `Uploaded ${file.name}: ${text}`, isOptimistic: true };
      setOptimisticMessages([userMsg]);
      setInput("");
      setSelectedFile(null);
    },
    onSuccess: (data) => {
      const aiMsg: OptimisticMessage = {
        role: "assistant",
        content: data.message,
        type: "import-confirmation",
        data: data 
      };
      setOptimisticMessages([aiMsg]); 
    },
    onError: () => {
      setOptimisticMessages([]);
      toast({ title: "Upload Failed", variant: "destructive" });
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteSession(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      if (currentSessionId === deletedId) handleNewChat();
      toast({ title: "Deleted", description: "Chat session removed." });
    }
  });

  useEffect(() => {
    const state = location.state as { initialPrompt?: string } | null;
    if (state?.initialPrompt) {
      sendMessageMutation.mutate(state.initialPrompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, sendMessageMutation]);

  const handleSend = () => {
    if (!input.trim() && !selectedFile) return;
    if (selectedFile) uploadFileMutation.mutate({ file: selectedFile, text: input });
    else sendMessageMutation.mutate(input);
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setInput("");
    setSelectedFile(null);
    setOptimisticMessages([]);
    localStorage.removeItem("tradeLm_activeSessionId");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
      e.target.value = ""; 
    }
  };

  // Combine history + optimistic
  const displayMessages = [...history];
  optimisticMessages.forEach(optMsg => {
    // Deduplication logic for User Messages
    const lastHistoryMsg = displayMessages[displayMessages.length - 1];
    if (optMsg.role === 'user' && lastHistoryMsg?.role === 'user' && lastHistoryMsg.content === optMsg.content) {
      return;
    }
    displayMessages.push(optMsg);
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages.length]);

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-background to-muted/10">
      
      {!currentSessionId && displayMessages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
           {/* Header */}
           <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center max-w-4xl mx-auto w-full">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent">
                    <span className="font-semibold text-lg">TradeLM Assistant</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem onClick={handleNewChat} disabled={!currentSessionId}>
                    <Plus className="h-4 w-4 mr-2" /> New Chat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-48">
                    {sessions.map(session => (
                      <DropdownMenuItem key={session.id} onClick={() => setCurrentSessionId(session.id)}>
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="truncate">{session.topic}</span>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>

          <div className="text-center space-y-4 mt-12">
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
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button key={action.label} variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all" onClick={() => sendMessageMutation.mutate(action.label)}>
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
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent">
                    <span className="font-semibold text-lg max-w-[200px] truncate text-left">
                        {sessions.find(s => s.id === currentSessionId)?.topic || "Current Chat"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuItem onClick={handleNewChat} disabled={!currentSessionId}>
                    <Plus className="h-4 w-4 mr-2" /> New Chat
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-48">
                    {sessions.map(session => (
                      <DropdownMenuItem key={session.id} onClick={() => setCurrentSessionId(session.id)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="truncate">{session.topic}</span>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Chat?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently remove this conversation history.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => currentSessionId && deleteSessionMutation.mutate(currentSessionId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-6 pb-32">
              {displayMessages.map((message, idx) => (
                <div key={idx} className={cn("flex gap-3 animate-in fade-in slide-in-from-bottom-2", message.role === "user" ? "justify-end" : "justify-start")}>
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 shadow-sm",
                    message.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted/50 border border-border/50 rounded-tl-sm backdrop-blur-sm"
                  )}>
                    {/* --- WIDGET RENDERER --- */}
                    
                    {/* 1. CSV Import Confirmation */}
                    {message.type === "import-confirmation" && message.data ? (
                      <ImportMappingCard 
                        data={message.data} 
                        onComplete={(summary: string) => {
                          setOptimisticMessages([{ role: "assistant", content: summary }]);
                          queryClient.invalidateQueries({ queryKey: ['chat-history'] });
                        }} 
                      />
                    ) 
                    
                    // 2. Trade Draft (Interactive Form)
                    : message.type === "trade-confirmation" && message.data ? (
                       <TradeConfirmationCard
                          data={message.data}
                          // ✅ Pass data back to parent on success
                          onConfirm={(savedTrade) => handleTradeComplete(savedTrade)}
                          onCancel={() => setOptimisticMessages([])}
                       />
                    ) 
                    
                    // 3. Trade Receipt (Read-Only Success)
                    : message.type === "trade-receipt" && message.data ? (
                       <div className="w-full max-w-md">
                          <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 px-1">
                             <span className="text-sm font-medium">Successfully Logged</span>
                          </div>
                          <TradeCard trade={message.data} />
                       </div>
                    ) 
                    
                    // 4. Standard Text
                    : (
                      <div className="text-sm leading-relaxed">
                        {message.role === "user" ? (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        )}
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                     <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4" />
                     </div>
                  )}
                </div>
              ))}
              
              {(sendMessageMutation.isPending || uploadFileMutation.isPending) && (
                <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2">
                   <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <Sparkles className="h-4 w-4 text-white animate-pulse" />
                   </div>
                   <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-sm px-5 py-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">Thinking...</span>
                   </div>
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
          {selectedFile && (
            <div className="absolute -top-10 left-4 bg-background border px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <span className="font-semibold text-primary">File:</span> {selectedFile.name}
              <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-destructive ml-2">×</button>
            </div>
          )}

          <div className="relative flex items-center gap-2 bg-background/80 backdrop-blur-xl p-2 rounded-full border border-border shadow-2xl ring-1 ring-white/10">
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileSelect} />
            <Button size="icon" variant="ghost" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 ml-1" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-5 w-5" />
            </Button>

            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={selectedFile ? "Add a message about this file..." : "Ask anything about your trading..."}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 px-2 h-12 text-base"
              disabled={sendMessageMutation.isPending || uploadFileMutation.isPending}
            />
            
            <Button size="icon" className={cn("h-10 w-10 rounded-full shadow-md transition-all duration-300", (sendMessageMutation.isPending || uploadFileMutation.isPending) ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:scale-105")} onClick={handleSend} disabled={(!input.trim() && !selectedFile) || sendMessageMutation.isPending || uploadFileMutation.isPending}>
              {(sendMessageMutation.isPending || uploadFileMutation.isPending) ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};