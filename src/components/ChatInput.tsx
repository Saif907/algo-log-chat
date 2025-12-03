import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 bg-background/80 backdrop-blur-xl rounded-full border border-border px-3 sm:px-5 py-2.5 sm:py-3 shadow-2xl">
          {showCount && (
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {showCount}
            </span>
          )}
          
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend?.()}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0 flex-1 text-sm sm:text-base"
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
              onClick={onSend}
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
  );
};
