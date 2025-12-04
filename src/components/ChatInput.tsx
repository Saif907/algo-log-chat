import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  placeholder?: string;
  showPagination?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  showCount?: string;
  onSend?: () => void;
  value?: string;
  onChange?: (value: string) => void;
}

export const ChatInput = ({ 
  placeholder = "Ask anything...", 
  showPagination = false,
  onPrevious,
  onNext,
  showCount,
  onSend,
  value = "",
  onChange
}: ChatInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const { sidebarWidth, isMobile } = useSidebar();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = value !== undefined ? value : localValue;
  const hasContent = currentValue.length > 0;

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!hasContent) {
      setIsExpanded(false);
    }
  };

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalValue(newValue);
    }
  };

  const handleSend = () => {
    onSend?.();
    if (!onChange) {
      setLocalValue("");
    }
    setIsExpanded(false);
  };

  // Calculate content area width and center position
  const contentLeft = isMobile ? 0 : sidebarWidth;
  const contentWidth = typeof window !== 'undefined' ? window.innerWidth - contentLeft : 1000;
  const iconCenterLeft = contentLeft + (contentWidth / 2);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 z-50 transition-all duration-300 ease-in-out"
      style={{
        left: isExpanded ? `${contentLeft + 16}px` : `${iconCenterLeft}px`,
        right: isExpanded ? '16px' : 'auto',
        transform: isExpanded ? 'none' : 'translateX(-50%)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapsed Icon State */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "opacity-0 scale-0 absolute" : "opacity-100 scale-100"
        )}
      >
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-2xl bg-primary hover:bg-primary/90"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>

      {/* Expanded Input State */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out origin-center",
          isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute"
        )}
        style={{
          maxWidth: isMobile ? 'calc(100vw - 32px)' : `calc(100vw - ${contentLeft + 32}px)`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 bg-background/80 backdrop-blur-xl rounded-full border border-border px-3 sm:px-5 py-2.5 sm:py-3 shadow-2xl">
            {showCount && (
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                {showCount}
              </span>
            )}
            
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 flex-1 text-sm sm:text-base min-w-0"
            />
            
            {showPagination ? (
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <button
                  onClick={onPrevious}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={onNext}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Next
                </button>
              </div>
            ) : (
              <Button 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex-shrink-0"
                onClick={handleSend}
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-[10px] sm:text-xs text-muted-foreground/60 text-center mt-2">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};
