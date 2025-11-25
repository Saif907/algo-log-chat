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
  value,
  onChange
}: ChatInputProps) => {
  const { collapsed, isMobile } = useSidebar();
  
  return (
    <div 
      className={cn(
        "fixed bottom-6 right-0 z-50 pointer-events-none transition-all duration-300",
        !isMobile && (collapsed ? "left-16" : "left-60"),
        isMobile && "left-0"
      )}
    >
      <div className="max-w-4xl mx-auto px-6 w-[90%] md:w-[65%]">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3 bg-background/80 backdrop-blur-xl rounded-full border border-border px-5 py-3 shadow-2xl">
            {showCount && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {showCount}
              </span>
            )}
            
            <Sparkles className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Input
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend?.()}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 flex-1"
            />
            
            {showPagination ? (
              <div className="flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={onPrevious}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Previous
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
                onClick={onSend}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground/60 text-center mt-2">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};
