// frontend/src/pages/AIChat.tsx
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Sparkles, Globe, TrendingUp, BarChart, Shield, 
  Plus, ChevronDown, MessageSquare, Trash2, Loader2, User,
  MoreHorizontal, Pencil, Check, X as XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/services/api"; 
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/contexts/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ImportMappingCard } from "@/components/chat/ImportMappingCard";
import { TradeConfirmationCard } from "@/components/chat/TradeConfirmationCard";
import { TradeCard } from "@/components/trades/TradeCard";
import { ChatInput } from "@/components/ChatInput"; 

// --- Types ---
interface OptimisticMessage {
  id?: string; 
  role: "user" | "assistant";
  content: string;
  isOptimistic?: boolean;
  type?: "text" | "import-confirmation" | "trade-confirmation" | "trade-receipt";
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
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    return localStorage.getItem("tradeLm_activeSessionId");
  });
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [input, setInput] = useState("");
  const [isWebSearch, setIsWebSearch] = useState(false);
  
  // Header Menu State
  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSessionId) localStorage.setItem("tradeLm_activeSessionId", currentSessionId);
    else localStorage.removeItem("tradeLm_activeSessionId");
  }, [currentSessionId]);

  // --- Queries ---
  const { data: sessions = [] } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => api.ai.getSessions(), 
  });

  const { data: history = [], isError: isHistoryError } = useQuery({
    queryKey: ['chat-history', currentSessionId],
    queryFn: () => currentSessionId ? api.ai.getHistory(currentSessionId) : Promise.resolve([]),
    enabled: !!currentSessionId,
    retry: 1,
  });

  useEffect(() => {
    if (isHistoryError) {
      handleNewChat();
      toast({ title: "Session expired", description: "Starting a new chat.", variant: "destructive" });
    }
  }, [isHistoryError]);

  // --- Mutations ---

  const renameSessionMutation = useMutation({
    mutationFn: ({ id, name }: { id: string, name: string }) => api.ai.renameSession(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      setEditingSessionId(null);
      toast({ title: "Updated", description: "Chat renamed successfully." });
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) => api.ai.deleteSession(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      if (currentSessionId === deletedId) handleNewChat();
      toast({ title: "Deleted", description: "Chat session removed." });
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const finalMessage = isWebSearch ? `[WEB SEARCH] ${text}` : text;
      return api.ai.sendMessage(currentSessionId || "", finalMessage); 
    },
    onMutate: async (text) => {
      const userMsg: OptimisticMessage = { 
        id: Math.random().toString(), 
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
        role: "user" as const, 
        content: variables, 
        created_at: new Date().toISOString() 
      };

      if (data.tool_call) {
        const toolMsg: OptimisticMessage = {
           id: "tool-" + Math.random(),
           role: "assistant",
           content: data.response,
           type: data.tool_call.type, 
           data: data.tool_call.data
        };
        queryClient.setQueryData(['chat-history', targetSessionId], (oldData: any[] | undefined) => [...(oldData || []), userMsg]);
        setOptimisticMessages([toolMsg]);
      } 
      else {
        const aiMsg = { role: "assistant" as const, content: data.response, created_at: new Date().toISOString() };
        queryClient.setQueryData(['chat-history', targetSessionId], (oldData: any[] | undefined) => [...(oldData || []), userMsg, aiMsg]);
        setOptimisticMessages([]); 
      }

      if (!currentSessionId) {
        setCurrentSessionId(targetSessionId);
        queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      }
    },
    onError: () => {
      setOptimisticMessages([]);
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, text }: { file: File, text: string }) => {
       return api.ai.uploadFile(file, currentSessionId || "", text);
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

  // --- Handlers ---
  
  const handleTradeComplete = (savedTradeData: any) => {
    setOptimisticMessages(prev => prev.map(msg => {
      if (msg.type === "trade-confirmation") {
        return { 
          ...msg, 
          type: "trade-receipt", 
          data: savedTradeData,
          content: "Trade successfully logged." 
        };
      }
      return msg;
    }));
    queryClient.invalidateQueries({ queryKey: ['trades'] });
  };

  useEffect(() => {
    const state = location.state as { initialPrompt?: string; initialUpload?: any } | null;
    if (state?.initialPrompt) {
      sendMessageMutation.mutate(state.initialPrompt);
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (state?.initialUpload) {
      handleNewChat();
      setOptimisticMessages([{
        role: "assistant",
        content: "Please confirm the column mapping for your file.",
        type: "import-confirmation",
        data: state.initialUpload
      }]);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, sendMessageMutation]);

  const handleSend = () => {
    if (selectedFile) uploadFileMutation.mutate({ file: selectedFile, text: input });
    else sendMessageMutation.mutate(input);
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setInput("");
    setSelectedFile(null);
    setOptimisticMessages([]);
    localStorage.removeItem("tradeLm_activeSessionId");
    setIsSessionMenuOpen(false);
  };

  const startEditing = (e: React.MouseEvent, session: { id: string, topic: string }) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditName(session.topic);
  };

  const saveRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingSessionId && editName.trim()) {
      renameSessionMutation.mutate({ id: editingSessionId, name: editName });
    }
  };

  const displayMessages = [...history];
  optimisticMessages.forEach(optMsg => {
    const lastHistoryMsg = displayMessages[displayMessages.length - 1];
    if (optMsg.role === 'user' && lastHistoryMsg?.role === 'user' && lastHistoryMsg.content === optMsg.content) return;
    displayMessages.push(optMsg);
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages.length]);

  return (
    <div className="h-screen flex flex-col relative bg-background">
      
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          
          {/* ✅ Improved Session List Popover */}
          <Popover open={isSessionMenuOpen} onOpenChange={setIsSessionMenuOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3 -ml-2 hover:bg-muted/50 rounded-xl transition-all h-10">
                <span className="font-semibold text-lg max-w-[200px] truncate text-left">
                    {sessions.find(s => s.id === currentSessionId)?.topic || "New Chat"}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isSessionMenuOpen && "rotate-180")} />
              </Button>
            </PopoverTrigger>
            
            <PopoverContent align="start" className="w-[340px] p-0 rounded-2xl shadow-xl border-border/60 overflow-hidden" sideOffset={8}>
              <div className="p-3 border-b border-border/40 bg-muted/20">
                <Button 
                  onClick={handleNewChat} 
                  className="w-full justify-start gap-2 bg-background hover:bg-muted/80 text-foreground border border-input shadow-sm" 
                  variant="outline"
                  size="lg"
                >
                  <Plus className="h-4 w-4 text-primary" /> 
                  <span className="font-medium">Start new chat</span>
                </Button>
              </div>
              
              <div className="py-2">
                <h4 className="px-4 py-1 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Recent</h4>
                <ScrollArea className="h-[320px]">
                  <div className="px-2 space-y-1 pb-2">
                    {sessions.map(session => (
                      <div 
                        key={session.id} 
                        onClick={() => { setCurrentSessionId(session.id); setIsSessionMenuOpen(false); }}
                        className={cn(
                          "group flex items-center justify-between w-full p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
                          session.id === currentSessionId 
                            ? "bg-primary/5 text-primary border-primary/10" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                          <MessageSquare className={cn("h-4 w-4 flex-shrink-0", session.id === currentSessionId ? "text-primary" : "text-muted-foreground/70")} />
                          
                          {/* Rename Input or Title */}
                          {editingSessionId === session.id ? (
                            <div className="flex items-center gap-1 flex-1 z-20" onClick={(e) => e.stopPropagation()}>
                              <Input 
                                value={editName} 
                                onChange={(e) => setEditName(e.target.value)}
                                className="h-7 text-sm px-2 bg-background"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && saveRename(e as any)}
                              />
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={saveRename}>
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setEditingSessionId(null)}>
                                <XIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="truncate text-sm font-medium pr-2">
                              {session.topic}
                            </span>
                          )}
                        </div>

                        {/* ✅ Hover Menu: Three Dots */}
                        {editingSessionId !== session.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 hover:bg-background shadow-sm border border-transparent hover:border-border"
                              >
                                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 rounded-xl">
                              <DropdownMenuItem onClick={(e) => startEditing(e, session)} className="gap-2">
                                <Pencil className="h-3.5 w-3.5" /> Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => { e.stopPropagation(); deleteSessionMutation.mutate(session.id); }} 
                                className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Global Delete for Current Chat (Legacy/Backup) */}
          {currentSessionId && (
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
          )}
        </div>
      </div>

      {!currentSessionId && displayMessages.length === 0 ? (
        // --- Empty State ---
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
        // --- Active Chat Area ---
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
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
                    {message.type === "import-confirmation" && message.data ? (
                      <ImportMappingCard 
                        data={message.data} 
                        sessionId={currentSessionId || undefined}
                        onComplete={(summary: string) => {
                          setOptimisticMessages([{ role: "assistant", content: summary }]);
                          queryClient.invalidateQueries({ queryKey: ['chat-history'] });
                          queryClient.invalidateQueries({ queryKey: ['trades'] });
                        }} 
                      />
                    ) : message.type === "trade-confirmation" && message.data ? (
                       <TradeConfirmationCard
                          data={message.data}
                          onConfirm={(savedTrade) => handleTradeComplete(savedTrade)}
                          onCancel={() => setOptimisticMessages([])}
                       />
                    ) : message.type === "trade-receipt" && message.data ? (
                       <div className="w-full max-w-md">
                          <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400 px-1">
                             <span className="text-sm font-medium">Successfully Logged</span>
                          </div>
                          <TradeCard trade={message.data} />
                       </div>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        {message.role === "user" ? (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        )}
                      </div>
                    )}
                  </div>
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
      <div className="p-4 pb-6 bg-background/50 backdrop-blur-sm z-50">
        <ChatInput 
          variant="docked"
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
          onFileRemove={() => setSelectedFile(null)}
          isLoading={sendMessageMutation.isPending || uploadFileMutation.isPending}
          placeholder={selectedFile ? "Add a message about this file..." : "Ask anything about your trading..."}
          isWebSearchEnabled={isWebSearch}
          onWebSearchToggle={() => setIsWebSearch(!isWebSearch)}
        />
        <div className="text-center mt-2 text-[10px] text-muted-foreground/60">
           TradeLM can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};