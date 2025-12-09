// frontend/src/components/trades/EditTradeModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { apiClient, Trade, Strategy } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  trade: Trade | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditTradeModal = ({ trade, open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    symbol: "",
    instrument_type: "STOCK",
    direction: "Long",
    status: "OPEN",
    entry_price: "",
    exit_price: "",
    quantity: "",
    stop_loss: "",
    target: "",
    entry_time: "",
    exit_time: "",
    strategy_id: "none",
    emotion: "Neutral",
    notes: ""
  });

  // 1. Fetch Strategies on Open
  useEffect(() => {
    if (open) {
      const fetchStrategies = async () => {
        try {
          const data = await apiClient.strategies.getAll();
          setStrategies(data || []);
        } catch (err) {
          console.error("Failed to load strategies", err);
        }
      };
      fetchStrategies();
    }
  }, [open]);

  // 2. Populate form SAFEGUARDED against nulls
  useEffect(() => {
    if (trade) {
      setFormData({
        symbol: trade.symbol || "",
        instrument_type: (trade as any).instrument_type || "STOCK",
        direction: trade.direction || "Long",
        status: trade.status || "OPEN",
        // ✅ FIX: Safe access with ?. and fallback to empty string
        entry_price: trade.entry_price?.toString() || "", 
        exit_price: trade.exit_price?.toString() || "",
        quantity: trade.quantity?.toString() || "",
        stop_loss: trade.stop_loss?.toString() || "",
        target: trade.target?.toString() || "",
        
        // Format ISO string to datetime-local (YYYY-MM-DDTHH:mm)
        entry_time: trade.entry_time ? new Date(trade.entry_time).toISOString().slice(0, 16) : "",
        exit_time: trade.exit_time ? new Date(trade.exit_time).toISOString().slice(0, 16) : "",
        
        strategy_id: (trade as any).strategy_id || "none",
        emotion: (trade as any).emotion || "Neutral",
        notes: trade.notes || ""
      });
    }
  }, [trade]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trade?.id) return;
    
    setLoading(true);

    try {
      // Basic Validation
      if (!formData.symbol || !formData.entry_price || !formData.quantity) {
        throw new Error("Please fill in required fields");
      }

      const payload = {
        symbol: formData.symbol.toUpperCase(),
        instrument_type: formData.instrument_type,
        direction: formData.direction,
        status: formData.status,
        entry_price: parseFloat(formData.entry_price),
        exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
        quantity: parseFloat(formData.quantity),
        stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
        target: formData.target ? parseFloat(formData.target) : null,
        entry_time: new Date(formData.entry_time).toISOString(),
        exit_time: formData.exit_time ? new Date(formData.exit_time).toISOString() : null,
        strategy_id: formData.strategy_id === "none" ? null : formData.strategy_id,
        emotion: formData.emotion,
        encrypted_notes: formData.notes
      };

      await apiClient.trades.update(trade.id, payload);

      toast({ title: "Updated", description: "Trade updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["trades"] }); // Refresh list
      queryClient.invalidateQueries({ queryKey: ["trade", trade.id] }); // Refresh detail
      onOpenChange(false);

    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Failed to update trade", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          
          {/* Top Row: Symbol & Instrument */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-symbol">Symbol</Label>
              <Input 
                id="edit-symbol" 
                value={formData.symbol}
                onChange={(e) => handleChange("symbol", e.target.value)}
                className="uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-instrument">Instrument</Label>
              <Select 
                value={formData.instrument_type} 
                onValueChange={(val) => handleChange("instrument_type", val)}
              >
                <SelectTrigger id="edit-instrument"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK">Stock</SelectItem>
                  <SelectItem value="CRYPTO">Crypto</SelectItem>
                  <SelectItem value="FOREX">Forex</SelectItem>
                  <SelectItem value="FUTURES">Futures</SelectItem>
                  <SelectItem value="OPTIONS">Options</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Direction & Status */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label>Direction</Label>
              <Select 
                value={formData.direction} 
                onValueChange={(val) => handleChange("direction", val)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Long">Long 🟢</SelectItem>
                  <SelectItem value="Short">Short 🔴</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-entry">Entry Price</Label>
              <Input 
                id="edit-entry" type="number" step="any"
                value={formData.entry_price}
                onChange={(e) => handleChange("entry_price", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exit">Exit Price</Label>
              <Input 
                id="edit-exit" type="number" step="any"
                value={formData.exit_price}
                onChange={(e) => handleChange("exit_price", e.target.value)}
              />
            </div>
          </div>

           {/* Row 4: Quantity & SL */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-qty">Quantity</Label>
              <Input 
                id="edit-qty" type="number" step="any"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sl">Stop Loss</Label>
              <Input 
                id="edit-sl" type="number" step="any"
                value={formData.stop_loss}
                onChange={(e) => handleChange("stop_loss", e.target.value)}
              />
            </div>
          </div>
          
          {/* Row 5: Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label>Entry Time</Label>
               <Input 
                  type="datetime-local"
                  value={formData.entry_time}
                  onChange={(e) => handleChange("entry_time", e.target.value)}
               />
            </div>
            <div className="space-y-2">
               <Label>Exit Time</Label>
               <Input 
                  type="datetime-local"
                  value={formData.exit_time}
                  onChange={(e) => handleChange("exit_time", e.target.value)}
               />
            </div>
          </div>

          {/* Row 6: Strategy & Emotion */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Strategy</Label>
                <Select 
                  value={formData.strategy_id} 
                  onValueChange={(val) => handleChange("strategy_id", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Strategy</SelectItem>
                    {strategies.map(s => (
                      <SelectItem key={s.id} value={s.id!}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Emotion</Label>
                <Select 
                  value={formData.emotion} 
                  onValueChange={(val) => handleChange("emotion", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Emotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Confident">Confident</SelectItem>
                    <SelectItem value="Fearful">Fearful</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Greedy">Greedy</SelectItem>
                    <SelectItem value="Revenge">Revenge</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea 
              id="edit-notes" 
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <DialogFooter>
             <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
             <Button type="submit" disabled={loading}>
               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
               Update Trade
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};