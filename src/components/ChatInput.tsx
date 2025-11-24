import { Sparkles, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  placeholder?: string;
  showPagination?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  showCount?: string;
}

export const ChatInput = ({ 
  placeholder = "Ask anything...", 
  showPagination = false,
  onPrevious,
  onNext,
  showCount
}: ChatInputProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        {showCount && (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {showCount}
          </span>
        )}
        
        <div className="flex-1 flex items-center gap-3 bg-card rounded-full border border-border px-4 py-2.5 shadow-sm">
          <Sparkles className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder={placeholder}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto py-0"
          />
          <Button 
            size="icon" 
            className="h-8 w-8 rounded-full flex-shrink-0"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>

        {showPagination && (
          <div className="flex items-center gap-4">
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
        )}
      </div>
    </div>
  );
};
