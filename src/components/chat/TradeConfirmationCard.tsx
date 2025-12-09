// frontend/src/components/chat/TradeConfirmationCard.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { apiClient, Strategy } from "@/lib/api-client"; 
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface TradeData {
  symbol: string;
  direction: string;
  entry_price: number;
  quantity: number;
  stop_loss?: number;
  target?: number;
  notes?: string;
  entry_time?: string; 
  instrument_type?: string;
}

interface Props {
  data: TradeData;
  onConfirm: (savedData: any) => void; // ✅ Changed signature
  onCancel: () => void;
}

export const TradeConfirmationCard = ({ data, onConfirm, onCancel }: Props) => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  
  // Initialize state
  const [trade, setTrade] = useState({
    ...data,
    direction: data.direction ? data.direction.charAt(0).toUpperCase() + data.direction.slice(1).toLowerCase() : "Long",
    instrument_type: data.instrument_type || "STOCK",
    entry_time: data.entry_time ? new Date(data.entry_time) : new Date(),
    strategy_id: "none",
    emotion: "Neutral"
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const data = await apiClient.strategies.getAll();
        setStrategies(data || []);
      } catch (err) {
        console.error("Failed to load strategies", err);
      }
    };
    fetchStrategies();
  }, []);

  const mapToCardData = (apiTrade: any) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return { date: "-", time: "-" };
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      };
    };

    const entry = formatDate(apiTrade.entry_time);
    const exit = formatDate(apiTrade.exit_time);
    const stratName = strategies.find(s => s.id === apiTrade.strategy_id)?.name || "No Strategy";

    return {
      id: apiTrade.id,
      symbol: apiTrade.symbol,
      direction: apiTrade.direction,
      instrument_type: apiTrade.instrument_type,
      status: apiTrade.status,
      entry: { date: entry.date, time: entry.time, price: apiTrade.entry_price },
      exit: { date: exit.date, time: exit.time, price: apiTrade.exit_price || 0 },
      quantity: apiTrade.quantity,
      pl: apiTrade.pnl || 0,
      rMultiple: 0,
      playbook: stratName,
      tags: apiTrade.tags || []
    };
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        symbol: trade.symbol.toUpperCase(),
        instrument_type: trade.instrument_type,
        direction: trade.direction,
        status: "Open",
        entry_price: Number(trade.entry_price),
        quantity: Number(trade.quantity),
        stop_loss: trade.stop_loss ? Number(trade.stop_loss) : null,
        target: trade.target ? Number(trade.target) : null,
        entry_time: trade.entry_time.toISOString(),
        encrypted_notes: trade.notes,
        strategy_id: trade.strategy_id === "none" ? null : trade.strategy_id,
        emotion: trade.emotion,
        fees: 0
      };

      const response = await apiClient.trades.create(payload);
      const cardData = mapToCardData(response);
      
      toast({ title: "Trade Logged", description: `${trade.symbol} trade saved successfully.` });
      
      // ✅ Hand off to parent immediately
      onConfirm(cardData);
      
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Failed to save trade.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 w-full max-w-md border-primary/20 shadow-md space-y-4 bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h3 className="font-semibold">Confirm Trade</h3>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">AI Draft</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Symbol</Label>
          <Input 
            value={trade.symbol} 
            onChange={(e) => setTrade({...trade, symbol: e.target.value.toUpperCase()})}
            className="h-8 text-sm font-semibold tracking-wide"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select 
            value={trade.instrument_type} 
            onValueChange={(val) => setTrade({...trade, instrument_type: val})}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="STOCK">Stock</SelectItem>
              <SelectItem value="CRYPTO">Crypto</SelectItem>
              <SelectItem value="FOREX">Forex</SelectItem>
              <SelectItem value="FUTURES">Futures</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Direction</Label>
          <Select 
            value={trade.direction} 
            onValueChange={(val) => setTrade({...trade, direction: val})}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Long">Long 🟢</SelectItem>
              <SelectItem value="Short">Short 🔴</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Entry Time</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-3 w-3" />
                {trade.entry_time ? format(trade.entry_time, "MMM d, HH:mm") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={trade.entry_time}
                onSelect={(date) => date && setTrade({...trade, entry_time: date})}
                initialFocus
              />
              <div className="p-2 border-t text-xs text-center text-muted-foreground">
                Time set to {format(trade.entry_time, "HH:mm")}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Entry Price</Label>
          <Input 
            type="number" 
            step="any"
            value={trade.entry_price} 
            onChange={(e) => setTrade({...trade, entry_price: parseFloat(e.target.value)})}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Quantity</Label>
          <Input 
            type="number" 
            step="any"
            value={trade.quantity} 
            onChange={(e) => setTrade({...trade, quantity: parseFloat(e.target.value)})}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Strategy</Label>
          <Select 
            value={trade.strategy_id} 
            onValueChange={(val) => setTrade({...trade, strategy_id: val})}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Strategy</SelectItem>
              {strategies.map(s => (
                <SelectItem key={s.id} value={s.id!}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Emotion</Label>
          <Select 
            value={trade.emotion} 
            onValueChange={(val) => setTrade({...trade, emotion: val})}
          >
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
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

      <div className="flex gap-2 pt-2 border-t border-border/50">
        <Button variant="ghost" size="sm" className="flex-1 hover:bg-destructive/10 hover:text-destructive" onClick={onCancel}>
          Discard
        </Button>
        <Button size="sm" className="flex-1 bg-primary/90 hover:bg-primary" onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
          {loading ? "Saving..." : "Confirm Log"}
        </Button>
      </div>
    </Card>
  );
};