import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Check, Loader2, FileSpreadsheet } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface ImportMappingCardProps {
  data: {
    file_path: string;
    filename: string;
    mapping: Record<string, string>;
    detected_headers: string[];
  };
  onComplete: (summary: string) => void;
}

const TARGET_FIELDS = [
  { key: "symbol", label: "Symbol/Ticker", required: true },
  { key: "direction", label: "Direction (Long/Short)", required: true },
  { key: "entry_price", label: "Entry Price", required: true },
  { key: "entry_time", label: "Entry Date", required: true },
  { key: "quantity", label: "Quantity", required: true },
  { key: "exit_price", label: "Exit Price" },
  { key: "pnl", label: "P&L" },
  { key: "notes", label: "Notes" },
];

export const ImportMappingCard = ({ data, onComplete }: ImportMappingCardProps) => {
  const { toast } = useToast();
  const [mapping, setMapping] = useState(data.mapping);
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleMapChange = (target: string, header: string) => {
    setMapping(prev => ({ ...prev, [target]: header }));
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post<{ message: string }>("/chat/import-confirm", {
        file_path: data.file_path,
        mapping: mapping
      });
      
      setIsDone(true);
      onComplete(res.message);
      toast({ title: "Import Successful", description: res.message });
    } catch (error) {
      toast({ title: "Import Failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isDone) {
    return (
      <Card className="p-4 bg-success/10 border-success/30 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-success flex items-center justify-center text-white">
          <Check className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-success-foreground">Import Complete</p>
          <p className="text-xs text-muted-foreground">{data.filename} processed successfully.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 w-full max-w-md border-primary/20 shadow-md">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b">
        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <FileSpreadsheet className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">Confirm Import</h3>
          <p className="text-xs text-muted-foreground">{data.filename}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {TARGET_FIELDS.map((field) => (
          <div key={field.key} className="grid grid-cols-2 gap-2 items-center">
            <label className="text-xs font-medium text-muted-foreground">
              {field.label} {field.required && "*"}
            </label>
            <Select 
              value={mapping[field.key] || "ignore"} 
              onValueChange={(val) => handleMapChange(field.key, val)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select column..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ignore" className="text-muted-foreground italic">
                  -- Ignore --
                </SelectItem>
                {data.detected_headers.map(header => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <Button 
        className="w-full" 
        onClick={handleConfirm} 
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
        Import Trades
      </Button>
    </Card>
  );
};