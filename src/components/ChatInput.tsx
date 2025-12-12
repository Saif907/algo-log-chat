// frontend/src/components/ChatInput.tsx
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Paperclip, X, FileText } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

interface ChatInputProps {
  placeholder?: string;
  showPagination?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  showCount?: string;
  onSend?: () => void;
  value?: string;
  onChange?: (value: string) => void;
  onFileSelect?: (file: File) => void;
  
  // ✅ New Props for Chat Page Integration
  selectedFile?: File | null;
  onFileRemove?: () => void;
  variant?: "floating" | "docked"; // 'docked' for AI Chat page, 'floating' for Dashboard
  isLoading?: boolean;
}

export const ChatInput = ({ 
  placeholder = "Ask anything...", 
  showPagination = false,
  onPrevious,
  onNext,
  showCount,
  onSend,
  value,
  onChange,
  onFileSelect,
  selectedFile,
  onFileRemove,
  variant = "floating",
  isLoading = false
}: ChatInputProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarWidth, isMobile } = useSidebar();
  
  // Internal state for uncontrolled mode
  const [isExpanded, setIsExpanded] = useState(variant === "docked");
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Controlled vs Uncontrolled logic
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : localValue;
  const hasContent = currentValue.length > 0 || !!selectedFile;

  // --- Effect: Handle Variant Changes ---
  useEffect(() => {
    if (variant === "docked") {
      setIsExpanded(true);
    }
  }, [variant]);

  // --- Handlers ---

  const handleMouseEnter = () => {
    if (variant === "floating") setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (variant === "floating" && !hasContent && !isFocused) {
      setIsExpanded(false);
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      if (variant === "floating" && !hasContent && !containerRef.current?.matches(':hover')) {
        setIsExpanded(false);
      }
    }, 200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) onChange(newValue);
    if (!isControlled) setLocalValue(newValue);
  };

  const handleSend = () => {
    if (!currentValue.trim() && !selectedFile) return;

    if (onSend) {
      onSend();
    } else {
      // Default: Navigate to Chat with state
      navigate("/ai-chat", { 
        state: { initialPrompt: currentValue } 
        // Note: We cannot pass the 'File' object via state safely. 
        // Dashboard usage implies text-only start usually.
      });
    }
    
    if (!isControlled) setLocalValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onFileSelect) {
      onFileSelect(e.target.files[0]);
      e.target.value = ""; // Reset to allow re-selection
    }
  };

  // Auto-focus when expanding (floating only)
  useEffect(() => {
    if (variant === "floating" && isExpanded && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isExpanded, variant]);

  // Positioning
  const contentLeft = isMobile ? 16 : sidebarWidth + 16;
  const contentRight = 16;
  
  // Docked styles vs Floating styles
  const containerClasses = variant === "docked" 
    ? "relative w-full max-w-4xl mx-auto" 
    : "fixed bottom-6 z-50 flex justify-center pointer-events-none";
    
  const wrapperClasses = variant === "docked"
    ? "relative flex flex-col items-start rounded-3xl shadow-lg border border-border bg-background/80 backdrop-blur-xl ring-1 ring-white/10 transition-all duration-300"
    : cn(
        "pointer-events-auto relative flex items-center rounded-full shadow-2xl overflow-hidden bg-background/80 backdrop-blur-xl border border-border ring-1 ring-white/10",
        "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isExpanded 
          ? "w-[calc(100vw-32px)] md:w-[600px] lg:w-[700px] bg-background" 
          : "w-12 h-12 border-transparent bg-primary hover:bg-primary/90 hover:scale-110 cursor-pointer shadow-primary/25"
      );

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      style={variant === "floating" ? { left: contentLeft, right: contentRight } : undefined}
    >
      <div 
        className={wrapperClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => variant === "floating" && !isExpanded && setIsExpanded(true)}
      >
        {/* Floating Icon (Only visible when collapsed) */}
        {variant === "floating" && !isExpanded && (
          <div className="flex items-center justify-center w-full h-full text-primary-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
        )}

        {/* Content Area (Visible when expanded or docked) */}
        {(isExpanded || variant === "docked") && (
          <div className="w-full flex flex-col">
            
            {/* 1. File Preview Chip */}
            {selectedFile && (
               <div className="px-4 pt-3 pb-1 w-full animate-in fade-in slide-in-from-bottom-2">
                 <div className="bg-muted/50 p-2 rounded-xl flex items-center gap-3 border border-border/50 shadow-sm w-fit max-w-full">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                       <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                       <span className="text-sm font-medium truncate max-w-[180px] sm:max-w-[240px]">
                         {selectedFile.name}
                       </span>
                       <span className="text-[10px] text-muted-foreground">
                         {(selectedFile.size / 1024).toFixed(1)} KB
                       </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileRemove?.();
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                 </div>
               </div>
            )}

            {/* 2. Input Row */}
            <div className="flex items-center w-full p-2 gap-2">
              {/* File Upload Trigger */}
              {onFileSelect && (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0",
                      variant === "docked" ? "h-9 w-9" : "h-8 w-8"
                    )}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    title="Attach file"
                    disabled={isLoading}
                  >
                    <Paperclip className={cn(selectedFile ? "h-4 w-4 text-primary" : "h-5 w-5")} />
                  </Button>
                </>
              )}

              {/* Text Input */}
              <div className="flex-1 flex items-center min-w-0">
                {showCount && (
                  <span className="text-xs text-muted-foreground mr-2 whitespace-nowrap hidden sm:inline-block">
                    {showCount}
                  </span>
                )}
                
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={selectedFile ? "Add a message about this file..." : placeholder}
                  value={currentValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground/50 w-full",
                    variant === "docked" ? "h-10 text-base" : "h-full"
                  )}
                />
              </div>
              
              {/* Pagination (Optional) */}
              {showPagination && (
                <div className="flex items-center gap-2 flex-shrink-0 mx-2">
                  <button onClick={onPrevious} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1">Prev</button>
                  <button onClick={onNext} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1">Next</button>
                </div>
              )}

              {/* Send Button */}
              {!showPagination && (
                <Button 
                  size="icon" 
                  className={cn(
                    "rounded-full flex-shrink-0 transition-all duration-300",
                    (hasContent || isLoading)
                      ? "scale-100 opacity-100 rotate-0 bg-primary text-primary-foreground shadow-md hover:scale-105" 
                      : "scale-90 opacity-50 bg-muted text-muted-foreground",
                    variant === "docked" ? "h-9 w-9" : "h-8 w-8"
                  )}
                  onClick={handleSend}
                  disabled={(!hasContent && !selectedFile) || isLoading}
                >
                  <Send className={cn(variant === "docked" ? "h-4 w-4" : "h-3 w-3")} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Helper Text (Floating Only) */}
      {variant === "floating" && (
        <div 
          className={cn(
            "absolute -bottom-6 left-0 right-0 text-center text-[10px] text-muted-foreground/60 transition-all duration-500",
            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          AI can make mistakes. Check important info.
        </div>
      )}
    </div>
  );
};