// frontend/src/components/chat/ImportMappingCard.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Check, 
  Loader2, 
  FileSpreadsheet, 
  AlertCircle, 
  ArrowRight, 
  Database, 
  BrainCircuit,
  Coins,
  Globe,
  TrendingUp,
  Building2,
  LayoutGrid
} from "lucide-react";
import { api, UploadResponse } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  data: UploadResponse;
  onComplete: (summary: string) => void;
  sessionId?: string;
}

// --- Helper: Modern Instrument Badges ---
const getInstrumentBadge = (type?: string) => {
  const t = (type || "STOCK").toUpperCase();
  switch (t) {
    case "CRYPTO":
      return (
        <Badge variant="outline" className="gap-1.5 bg-blue-500/10 text-blue-600 border-blue-200/40 hover:bg-blue-500/20 transition-colors">
          <Coins className="w-3 h-3" />
          Crypto
        </Badge>
      );
    case "FOREX":
      return (
        <Badge variant="outline" className="gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-200/40 hover:bg-emerald-500/20 transition-colors">
          <Globe className="w-3 h-3" />
          Forex
        </Badge>
      );
    case "FUTURES":
      return (
        <Badge variant="outline" className="gap-1.5 bg-orange-500/10 text-orange-600 border-orange-200/40 hover:bg-orange-500/20 transition-colors">
          <TrendingUp className="w-3 h-3" />
          Futures
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1.5 bg-slate-500/10 text-slate-600 border-slate-200/40 hover:bg-slate-500/20 transition-colors">
          <Building2 className="w-3 h-3" />
          Stock
        </Badge>
      );
  }
};

export const ImportMappingCard = ({ data, onComplete, sessionId }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const mapping = data.mapping;
  // Invert mapping for easy lookup (Source Header -> Target Field)
  const headerToTarget = Object.entries(mapping).reduce((acc, [target, source]) => {
    acc[source] = target;
    return acc;
  }, {} as Record<string, string>);

  const unmappedCount = data.detected_headers.length - Object.keys(mapping).length;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await api.ai.confirmImport(data.file_path, mapping, sessionId);
      
      toast({ 
        title: "Import Successful", 
        description: `Successfully logged ${res.count} trades to your journal.` 
      });
      
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
    <Card className="w-full max-w-5xl border border-border/40 shadow-xl bg-card/95 backdrop-blur-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
      
      {/* --- Professional Header --- */}
      <div className="bg-gradient-to-r from-muted/50 to-background p-4 border-b border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-sm">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm text-foreground tracking-tight">Import Data Preview</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="font-medium">{data.filename}</span>
              <span className="text-border/60">•</span>
              <span>{data.preview?.length || 0} rows found</span>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
            <div className="flex items-center px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-700 dark:text-green-400">
                <Check className="w-3 h-3 mr-1.5" />
                {Object.keys(mapping).length} Columns Mapped
            </div>
            {unmappedCount > 0 && (
                <div className="flex items-center px-2.5 py-1 rounded-md bg-muted border border-border text-xs font-medium text-muted-foreground">
                    <Database className="w-3 h-3 mr-1.5" />
                    {unmappedCount} Metadata
                </div>
            )}
        </div>
      </div>

      {/* --- Data Grid --- */}
      <div className="relative border-b border-border/40 bg-muted/5">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max min-w-full">
            <Table>
              <TableHeader className="bg-muted/30 sticky top-0 z-10 shadow-sm">
                <TableRow className="hover:bg-transparent border-b border-border/40">
                  
                  {/* System Column: Instrument Type */}
                  <TableHead className="h-auto py-3 px-4 text-left min-w-[140px] border-r border-border/40 bg-muted/40 backdrop-blur-sm">
                     <div className="flex flex-col gap-2">
                        <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                            <BrainCircuit className="w-3.5 h-3.5 text-primary" />
                            AI Classification
                        </span>
                     </div>
                  </TableHead>

                  {/* Dynamic CSV Columns */}
                  {data.detected_headers.map((header) => {
                    const mappedTarget = headerToTarget[header];
                    return (
                      <TableHead key={header} className="h-auto py-3 px-4 text-left min-w-[180px] border-r border-border/40 last:border-r-0 bg-muted/20">
                        <div className="flex flex-col gap-2">
                          <span className="font-bold text-foreground text-[11px] uppercase tracking-wider truncate" title={header}>
                            {header}
                          </span>
                          {mappedTarget ? (
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 w-fit">
                              <ArrowRight className="w-3 h-3" />
                              {mappedTarget}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border w-fit">
                              <Database className="w-3 h-3" />
                              Stored as Metadata
                            </div>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Rows */}
                {data.preview && data.preview.length > 0 ? (
                  data.preview.map((row, idx) => (
                    <TableRow key={idx} className="group hover:bg-muted/50 transition-colors border-border/40">
                      
                      {/* Instrument Type Cell */}
                      <TableCell className="py-3 px-4 border-r border-border/40 bg-muted/5 group-hover:bg-muted/20 transition-colors">
                          {getInstrumentBadge(row["__instrument_type"])}
                      </TableCell>

                      {/* Data Cells */}
                      {data.detected_headers.map((header) => (
                        <TableCell key={`${idx}-${header}`} className="py-3 px-4 text-xs border-r border-border/40 last:border-r-0 max-w-[200px] truncate font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                          {row[header] !== undefined && row[header] !== null && String(row[header]).trim() !== "" ? (
                            String(row[header])
                          ) : (
                            <span className="text-muted-foreground/30 italic">null</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={data.detected_headers.length + 1} className="h-32 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin opacity-50" />
                            <span>Loading preview...</span>
                        </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" className="h-2.5" />
        </ScrollArea>
      </div>

      {/* --- Footer Actions --- */}
      <div className="p-4 bg-background/50 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-border/40">
        <div className="flex items-center gap-3 text-xs text-muted-foreground bg-blue-500/5 px-3 py-2 rounded-lg border border-blue-500/10 w-full sm:w-auto">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <span className="leading-tight">
              Please review the columns above. <br className="hidden sm:inline"/>
              Unmapped columns will be preserved as metadata.
            </span>
        </div>
        
        <Button 
          className="w-full sm:w-auto min-w-[160px] font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02]" 
          onClick={handleConfirm} 
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Importing...
            </>
          ) : (
            <>
              Confirm Import
              <ArrowRight className="ml-2 h-4 w-4 opacity-70" /> 
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};