import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface TradeData {
  symbol: string;
  direction: string;
  entry_price: number;
  quantity: number;
  stop_loss?: number;
  target?: number;
  notes?: string;
}

interface Props {
  data: TradeData;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TradeConfirmationCard = ({ data, onConfirm, onCancel }: Props) => {
  const { toast } = useToast();
  // Ensure defaults match your backend expectations (Title Case)
  const [trade, setTrade] = useState({
    ...data,
    direction: data.direction ? data.direction.charAt(0).toUpperCase() + data.direction.slice(1).toLowerCase() : "Long"
  });
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // ✅ FIX 2: Correct payload structure
      const payload = {
        symbol: trade.symbol.toUpperCase(),
        direction: trade.direction,
        status: "Open",
        entry_price: Number(trade.entry_price),
        quantity: Number(trade.quantity),
        stop_loss: trade.stop_loss ? Number(trade.stop_loss) : null,
        target: trade.target ? Number(trade.target) : null,
        
        // ✅ KEY FIX: Use 'entry_time' to match Backend Model & DB
        entry_time: new Date().toISOString(), 
        
        encrypted_notes: trade.notes,
        fees: 0
      };

      await apiClient.trades.create(payload);
      
      setIsSaved(true);
      toast({ title: "Trade Logged", description: `${trade.symbol} trade saved successfully.` });
      onConfirm();
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Failed to save trade.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isSaved) {
    return (
      <Card className="p-4 bg-green-500/10 border-green-500/30 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
          <Check className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-green-700 dark:text-green-300">Trade Logged</p>
          <p className="text-xs text-muted-foreground">{trade.symbol} {trade.direction} @ {trade.entry_price}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 w-full max-w-md border-primary/20 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold">Confirm Trade</h3>
        <span className="text-xs text-muted-foreground">AI Draft</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Symbol</Label>
          <Input 
            value={trade.symbol} 
            onChange={(e) => setTrade({...trade, symbol: e.target.value.toUpperCase()})}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Direction</Label>
          <Select 
            value={trade.direction} 
            onValueChange={(val) => setTrade({...trade, direction: val})}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Long">Long</SelectItem>
              <SelectItem value="Short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Entry Price</Label>
          <Input 
            type="number" 
            value={trade.entry_price} 
            onChange={(e) => setTrade({...trade, entry_price: parseFloat(e.target.value)})}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Quantity</Label>
          <Input 
            type="number" 
            value={trade.quantity} 
            onChange={(e) => setTrade({...trade, quantity: parseFloat(e.target.value)})}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" className="flex-1" onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm & Save"}
        </Button>
      </div>
    </Card>
  );
};