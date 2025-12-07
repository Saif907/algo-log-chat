import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trade?: {
    id: string;
    symbol: string;
    side: string;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    entryDate: string;
    exitDate: string;
    notes?: string;
    stopLoss?: number;
    target?: number;
    strategyId?: string;
    emotion?: string;
  };
}

export const EditTradeModal = ({ open, onOpenChange, trade }: EditTradeModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      const fetchStrategies = async () => {
        const { data } = await supabase.from('strategies').select('id, name');
        if (data) setStrategies(data);
      };
      fetchStrategies();
    }
  }, [open]);

  const toDateTimeLocal = (dateStr?: string) => {
    if (!dateStr || dateStr === "-") return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return ""; 
    const offset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trade) return;
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const entryDate = formData.get("entry-date") as string;
    const exitDate = formData.get("exit-date") as string;
    
    const entryPrice = parseFloat(formData.get("entry-price") as string);
    const exitPrice = parseFloat(formData.get("exit-price") as string);
    const quantity = parseFloat(formData.get("quantity") as string);
    const stopLoss = parseFloat(formData.get("stop-loss") as string) || null;
    const target = parseFloat(formData.get("target") as string) || null;
    
    const direction = formData.get("side") as string;
    // Enum fix: Ensure UPPERCASE
    const directionFormatted = direction ? direction.toUpperCase() : "LONG";

    let pnl = null;
    if (!isNaN(entryPrice) && !isNaN(exitPrice) && !isNaN(quantity)) {
        if (directionFormatted === "LONG") {
            pnl = (exitPrice - entryPrice) * quantity;
        } else {
            pnl = (entryPrice - exitPrice) * quantity;
        }
    }

    // UUID Fix: Ensure empty string maps to null
    const rawStrategyId = formData.get("strategy") as string;
    const strategyId = (rawStrategyId && rawStrategyId !== "none" && rawStrategyId !== "") ? rawStrategyId : null;

    try {
        const tradeData = {
            symbol: (formData.get("symbol") as string).toUpperCase(),
            direction: directionFormatted,
            entry_price: entryPrice,
            exit_price: exitPrice,
            quantity: quantity,
            pnl: pnl,
            stop_loss: stopLoss,
            target: target,
            entry_time: new Date(entryDate).toISOString(),
            exit_time: exitDate ? new Date(exitDate).toISOString() : null,
            encrypted_notes: formData.get("notes") as string,
            strategy_id: strategyId,
            emotion: formData.get("emotional-state") as string,
        };

        const { error } = await supabase
            .from('trades')
            .update(tradeData)
            .eq('id', trade.id);

        if (error) throw error;

        toast({ title: "Success", description: "Trade updated successfully" });
        queryClient.invalidateQueries({ queryKey: ['trades'] });
        onOpenChange(false);
    } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const defaultEntryDate = toDateTimeLocal(trade?.entryDate);
  const defaultExitDate = toDateTimeLocal(trade?.exitDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Symbol</Label>
                <Input name="symbol" defaultValue={trade?.symbol} required />
              </div>
              <div className="space-y-2">
                <Label>Side</Label>
                <Select name="side" defaultValue={trade?.side?.toLowerCase() || 'long'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Entry Price</Label>
                <Input name="entry-price" type="number" step="0.0001" defaultValue={trade?.entryPrice} required />
              </div>
              <div className="space-y-2">
                <Label>Exit Price</Label>
                <Input name="exit-price" type="number" step="0.0001" defaultValue={trade?.exitPrice} />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input name="quantity" type="number" defaultValue={trade?.quantity} required />
              </div>
              <div className="space-y-2">
                <Label>Entry Time</Label>
                <Input name="entry-date" type="datetime-local" defaultValue={defaultEntryDate} required />
              </div>
              <div className="space-y-2">
                <Label>Exit Time</Label>
                <Input name="exit-date" type="datetime-local" defaultValue={defaultExitDate} />
              </div>
              <div className="space-y-2">
                  <Label>Stop Loss</Label>
                  <Input name="stop-loss" type="number" step="0.0001" defaultValue={trade?.stopLoss} />
              </div>
              <div className="space-y-2">
                  <Label>Target</Label>
                  <Input name="target" type="number" step="0.0001" defaultValue={trade?.target} />
              </div>
              <div className="space-y-2">
                  <Label>Strategy</Label>
                  <Select name="strategy" defaultValue={trade?.strategyId || "none"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Strategy</SelectItem>
                      {strategies.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label>Emotion</Label>
                  <Select name="emotional-state" defaultValue={trade?.emotion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Emotion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confident">Confident</SelectItem>
                      <SelectItem value="Fearful">Fearful</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                      <SelectItem value="Greedy">Greedy</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
            <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea name="notes" defaultValue={trade?.notes} />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Update
                </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};