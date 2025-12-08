import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Paperclip } from "lucide-react"; // Added Paperclip
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
  onFileSelect?: (file: File) => void; // ✅ New Prop for File Upload
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
  onFileSelect
}: ChatInputProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarWidth, isMobile } = useSidebar();
  
  // Internal state
  const [isExpanded, setIsExpanded] = useState(false);
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // ✅ Ref for hidden file input

  // Controlled vs Uncontrolled logic
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : localValue;
  const hasContent = currentValue.length > 0;

  // --- Handlers ---

  const handleMouseEnter = () => setIsExpanded(true);

  const handleMouseLeave = () => {
    if (!hasContent && !isFocused) {
      setIsExpanded(false);
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => {
      if (!hasContent && !containerRef.current?.matches(':hover')) {
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
    if (!currentValue.trim()) return;

    if (location.pathname === "/ai-chat") {
      onSend?.();
    } else {
      // Pass message to AI Chat page
      navigate("/ai-chat", { state: { initialPrompt: currentValue } });
    }
    
    if (!isControlled) setLocalValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ New: Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onFileSelect) {
      onFileSelect(e.target.files[0]);
      // Reset input so same file can be selected again if needed
      e.target.value = "";
    }
  };

  // Auto-focus with slight delay for animation
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Calculate position
  const contentLeft = isMobile ? 16 : sidebarWidth + 16;
  const contentRight = 16;

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 z-50 flex justify-center pointer-events-none"
      style={{
        left: contentLeft,
        right: contentRight,
      }}
    >
      <div 
        className="pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={cn(
            "relative flex items-center rounded-full shadow-2xl overflow-hidden bg-background/80 backdrop-blur-xl border border-border ring-1 ring-white/10",
            // Smooth Quintic Easing
            "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
            isExpanded 
              ? "w-[calc(100vw-32px)] md:w-[600px] lg:w-[700px] bg-background" 
              : "w-12 h-12 border-transparent bg-primary hover:bg-primary/90 hover:scale-110 cursor-pointer shadow-primary/25"
          )}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          {/* Main Icon (Sparkles) */}
          <div 
            className={cn(
              "flex items-center justify-center flex-shrink-0 h-12 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
              isExpanded ? "w-12 text-primary" : "w-12 text-primary-foreground"
            )}
          >
            <Sparkles className={cn("transition-transform duration-500", isExpanded ? "h-5 w-5" : "h-6 w-6")} />
          </div>

          {/* Input Area */}
          <div 
            className={cn(
              "flex-1 flex items-center overflow-hidden h-12",
              "transition-all duration-300 ease-out", 
              isExpanded ? "opacity-100 translate-x-0 pr-2 delay-100" : "opacity-0 -translate-x-4 w-0 delay-0"
            )}
          >
            {/* ✅ File Upload Button (Only visible if handler provided) */}
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
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 mr-1 flex-shrink-0"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  title="Upload CSV"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </>
            )}

            {showCount && (
              <span className="text-xs text-muted-foreground mr-2 whitespace-nowrap animate-in fade-in zoom-in duration-300">
                {showCount}
              </span>
            )}
            
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={currentValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex-1 bg-transparent border-0 outline-none text-sm h-full min-w-0 placeholder:text-muted-foreground/50"
              tabIndex={isExpanded ? 0 : -1}
            />
            
            {/* Action Buttons */}
            {showPagination ? (
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <button onClick={onPrevious} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors">Prev</button>
                <button onClick={onNext} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 transition-colors">Next</button>
              </div>
            ) : (
              <Button 
                size="icon" 
                className={cn(
                  "h-8 w-8 rounded-full flex-shrink-0 ml-2 transition-all duration-300 ease-out",
                  currentValue.trim() 
                    ? "scale-100 opacity-100 rotate-0 bg-primary text-primary-foreground" 
                    : "scale-50 opacity-0 rotate-45 bg-muted text-muted-foreground"
                )}
                onClick={handleSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Helper Text */}
        <div 
          className={cn(
            "absolute -bottom-6 left-0 right-0 text-center text-[10px] text-muted-foreground/60 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
            isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          AI can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};