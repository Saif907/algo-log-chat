// frontend/src/components/chat/ImportMappingCard.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, FileSpreadsheet, AlertCircle, ArrowRight } from "lucide-react";
import { api, UploadResponse } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  data: UploadResponse;
  onComplete: (summary: string) => void;
  sessionId?: string; // ✅ Added to pass context to backend
}

export const ImportMappingCard = ({ data, onComplete, sessionId }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // We use the AI's proposed mapping by default
  const mapping = data.mapping;
  const unmappedCount = data.detected_headers.length - Object.keys(mapping).length;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // 1. Call Confirm API with Session ID
      const res = await api.ai.confirmImport(data.file_path, mapping, sessionId);
      
      // 2. Notify Success
      toast({ 
        title: "Import Successful", 
        description: `Successfully logged ${res.count} trades.` 
      });
      
      // 3. Callback to Chat (adds a system message locally)
      onComplete(`✅ **Import Complete**\nSuccessfully imported ${res.count} trades from ${data.filename}.`);
      
    } catch (error: any) {
      toast({ 
        title: "Import Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-primary/20 shadow-lg bg-card/95 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 p-3 border-b border-border/50 flex items-center gap-3">
        <div className="bg-green-500/10 p-2 rounded-lg">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Review Import</h3>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{data.filename}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Mapping Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
            <span>CSV Header</span>
            <span>Target Field</span>
          </div>
          
          <ScrollArea className="h-[180px] pr-2">
            <div className="space-y-2">
              {Object.entries(mapping).map(([target, source]) => (
                <div key={target} className="flex items-center justify-between bg-background border border-border p-2 rounded-md text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{source}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/50 mx-2" />
                  <Badge variant="secondary" className="font-semibold">{target}</Badge>
                </div>
              ))}
              
              {/* Show unmapped headers hint */}
              {unmappedCount > 0 && (
                <div className="flex items-center gap-2 p-2 text-xs text-yellow-600 bg-yellow-500/10 rounded-md">
                  <AlertCircle className="h-3 w-3" />
                  <span>{unmappedCount} columns will be stored as metadata.</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <Button 
            className="w-full font-semibold shadow-sm" 
            onClick={handleConfirm} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> 
                Confirm & Import
              </>
            )}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            Trades will be added to your journal immediately.
          </p>
        </div>
      </div>
    </Card>
  );
};