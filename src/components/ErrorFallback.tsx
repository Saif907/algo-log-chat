import { FallbackProps } from "react-error-boundary";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground space-y-6 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
        <p className="text-muted-foreground text-sm">
          We encountered an unexpected error. The application has been paused to prevent data loss.
        </p>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg max-w-lg w-full overflow-auto border border-border text-left">
        <p className="font-mono text-xs text-destructive break-all">
          {error.message}
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => window.location.href = '/'} variant="outline" className="gap-2">
          <Home className="h-4 w-4" />
          Go Home
        </Button>
        <Button onClick={resetErrorBoundary} className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
};