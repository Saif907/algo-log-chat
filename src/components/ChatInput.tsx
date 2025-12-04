import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [isFocused, setIsFocused] = useState(false);
  const { sidebarWidth, isMobile } = useSidebar();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = value !== undefined ? value : localValue;
  const hasContent = currentValue.length > 0;

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      // Small delay to ensure transition has started
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // Only collapse if not focused and no content
    if (!hasContent && !isFocused) {
      setIsExpanded(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Collapse if empty after blur (with small delay for click handling)
    setTimeout(() => {
      if (!hasContent && !containerRef.current?.matches(':hover')) {
        setIsExpanded(false);
      }
    }, 100);
  };

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalValue(newValue);
    }
  };

  const handleSend = () => {
    if (currentValue.trim()) {
      onSend?.();
      if (!onChange) {
        setLocalValue("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Calculate positions
  const contentLeft = isMobile ? 16 : sidebarWidth + 16;
  const contentRight = 16;

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-6 z-50"
      style={{
        left: contentLeft,
        right: contentRight,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-center">
        <div 
          className={cn(
            "relative flex items-center rounded-full shadow-2xl",
            "transition-all duration-[250ms] ease-out",
            isExpanded 
              ? "w-full max-w-4xl bg-background/95 backdrop-blur-xl border border-border" 
              : "w-12 bg-primary hover:bg-primary/90 cursor-pointer"
          )}
          style={{
            height: isExpanded ? 'auto' : '48px',
            minHeight: '48px',
          }}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          {/* Icon - always visible */}
          <div 
            className={cn(
              "flex items-center justify-center flex-shrink-0 transition-all duration-[250ms] ease-out",
              isExpanded ? "pl-4 pr-2" : "w-12 h-12"
            )}
          >
            <Sparkles 
              className={cn(
                "transition-colors duration-[250ms]",
                isExpanded ? "h-5 w-5 text-primary" : "h-5 w-5 text-primary-foreground"
              )} 
            />
          </div>

          {/* Expanded content */}
          <div 
            className={cn(
              "flex items-center gap-2 overflow-hidden transition-all duration-[250ms] ease-out",
              isExpanded ? "flex-1 opacity-100 py-3 pr-3" : "w-0 opacity-0 py-0 pr-0"
            )}
          >
            {showCount && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {showCount}
              </span>
            )}
            
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "flex-1 bg-transparent border-0 outline-none text-sm sm:text-base",
                "text-foreground placeholder:text-muted-foreground",
                "min-w-0",
                isExpanded ? "pointer-events-auto" : "pointer-events-none"
              )}
              style={{ 
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
              tabIndex={isExpanded ? 0 : -1}
            />
            
            {showPagination ? (
              <div className="flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={onPrevious}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={onNext}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Next
                </button>
              </div>
            ) : (
              <Button 
                size="icon" 
                className="h-9 w-9 rounded-full flex-shrink-0"
                onClick={handleSend}
                disabled={!currentValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Helper text */}
      <p 
        className={cn(
          "text-xs text-muted-foreground/60 text-center mt-2 transition-opacity duration-[250ms]",
          isExpanded ? "opacity-100" : "opacity-0"
        )}
      >
        AI can make mistakes. Check important info.
      </p>
    </div>
  );
};
