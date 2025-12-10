// frontend/src/components/chat/TradeConfirmationCard.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // ✅ Added Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Loader2, Calendar as CalendarIcon, X } from "lucide-react";
import { api, Strategy, InstrumentType, TradeDirection, TradeStatus } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch"; // ✅ Added Switch for Open/Closed

// Input data comes from the LLM (Agentic Draft)
interface TradeDraft {
  symbol: string;
  direction: string;
  entry_price: number;
  quantity: number;
  stop_loss?: number;
  target?: number;
  notes?: string;
  entry_time?: string;
  exit_time?: string;
  exit_price?: number;
  status?: string; // "OPEN" or "CLOSED"
  instrument_type?: string;
}

interface Props {
  data: TradeDraft;
  onConfirm: (savedData: any) => void;
  onCancel: () => void;
}

export const TradeConfirmationCard = ({ data, onConfirm, onCancel }: Props) => {
  const { toast } = useToast();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isClosed, setIsClosed] = useState(data.status?.toUpperCase() === "CLOSED" || !!data.exit_price);

  // Initialize state
  const [trade, setTrade] = useState({
    ...data,
    symbol: data.symbol.toUpperCase(),
    direction: (data.direction ? data.direction.charAt(0).toUpperCase() + data.direction.slice(1).toLowerCase() : "Long") as TradeDirection,
    instrument_type: (data.instrument_type?.toUpperCase() || "STOCK") as InstrumentType,
    
    // Dates
    entry_time: data.entry_time ? new Date(data.entry_time) : new Date(),
    exit_time: data.exit_time ? new Date(data.exit_time) : new Date(),
    
    strategy_id: "none",
    
    // Numbers
    entry_price: data.entry_price || 0,
    exit_price: data.exit_price || 0,
    quantity: data.quantity || 0,
    stop_loss: data.stop_loss || 0,
    target: data.target || 0,
    notes: data.notes || ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const list = await api.strategies.getAll();
        setStrategies(list || []);
      } catch (err) {
        console.error("Failed to load strategies", err);
      }
    };
    fetchStrategies();
  }, []);

  const handleSave = async () => {
    // Basic Validation
    if (!trade.symbol || trade.entry_price <= 0 || trade.quantity <= 0) {
      toast({ title: "Invalid Data", description: "Please check Price and Quantity.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        symbol: trade.symbol.toUpperCase(),
        instrument_type: trade.instrument_type,
        direction: trade.direction,
        status: (isClosed ? "CLOSED" : "OPEN") as TradeStatus, // ✅ Send correct status
        entry_price: Number(trade.entry_price),
        exit_price: isClosed ? Number(trade.exit_price) : undefined, // ✅ Send exit price if closed
        quantity: Number(trade.quantity),
        stop_loss: trade.stop_loss ? Number(trade.stop_loss) : undefined,
        target: trade.target ? Number(trade.target) : undefined,
        entry_time: trade.entry_time.toISOString(),
        exit_time: isClosed ? trade.exit_time.toISOString() : undefined, // ✅ Send exit time
        notes: trade.notes, // ✅ Send Notes
        strategy_id: trade.strategy_id === "none" ? undefined : trade.strategy_id,
      };

      const response = await api.trades.create(payload);
      
      // Basic mapping for receipt
      const cardData = {
        id: response.id,
        symbol: response.symbol,
        direction: response.direction,
        status: response.status,
        entry: { 
            date: new Date(response.entry_time).toLocaleDateString(), 
            price: response.entry_price 
        },
        exit: response.exit_time ? { 
            date: new Date(response.exit_time).toLocaleDateString(), 
            price: response.exit_price 
        } : undefined,
        quantity: response.quantity,
        pl: response.pnl || 0,
        playbook: strategies.find(s => s.id === response.strategy_id)?.name || "No Strategy"
      };
      
      toast({ title: "Trade Logged", description: `${trade.symbol} trade saved successfully.` });
      onConfirm(cardData);
      
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Failed to save trade.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 w-full max-w-md border-primary/20 shadow-xl space-y-4 bg-card/95 backdrop-blur-sm animate-in zoom-in-95 duration-200">
      
      {/* Header with Status Toggle */}
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full animate-pulse ${isClosed ? 'bg-gray-400' : 'bg-green-500'}`} />
          <h3 className="font-semibold text-sm">
             {isClosed ? "Log Closed Trade" : "Log Open Trade"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
            <Label htmlFor="status-mode" className="text-xs text-muted-foreground">Closed?</Label>
            <Switch 
                id="status-mode" 
                checked={isClosed} 
                onCheckedChange={setIsClosed} 
                className="scale-75"
            />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Symbol */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Symbol</Label>
          <Input 
            value={trade.symbol} 
            onChange={(e) => setTrade({...trade, symbol: e.target.value.toUpperCase()})}
            className="h-8 text-sm font-bold tracking-wide uppercase"
          />
        </div>

        {/* Instrument Type */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Market</Label>
          <Select 
            value={trade.instrument_type} 
            onValueChange={(val) => setTrade({...trade, instrument_type: val as InstrumentType})}
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

        {/* Direction */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Side</Label>
          <Select 
            value={trade.direction} 
            onValueChange={(val) => setTrade({...trade, direction: val as TradeDirection})}
          >
            <SelectTrigger className={`h-8 text-sm font-medium ${trade.direction === 'Long' ? 'text-green-500' : 'text-red-500'}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Long" className="text-green-500">Long 🟢</SelectItem>
              <SelectItem value="Short" className="text-red-500">Short 🔴</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Strategy Selector */}
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
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* --- Entry Section --- */}
        <div className="col-span-2 grid grid-cols-2 gap-3 bg-muted/30 p-2 rounded-md border border-border/50">
             <div className="col-span-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Entry Details</div>
             
             {/* Entry Price */}
             <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Entry Price</Label>
                <Input 
                    type="number" 
                    step="any"
                    value={trade.entry_price} 
                    onChange={(e) => setTrade({...trade, entry_price: parseFloat(e.target.value)})}
                    className="h-8 text-sm font-mono"
                />
            </div>

            {/* Quantity */}
            <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Quantity</Label>
                <Input 
                    type="number" 
                    step="any"
                    value={trade.quantity} 
                    onChange={(e) => setTrade({...trade, quantity: parseFloat(e.target.value)})}
                    className="h-8 text-sm font-mono"
                />
            </div>

            {/* Entry Date */}
            <div className="space-y-1 col-span-2">
                <Label className="text-xs text-muted-foreground">Entry Time</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-full justify-start text-left font-normal text-xs px-2">
                        <CalendarIcon className="mr-2 h-3 w-3 opacity-50" />
                        {trade.entry_time ? format(trade.entry_time, "MMM d, yyyy HH:mm") : <span>Pick date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={trade.entry_time}
                        onSelect={(date) => date && setTrade({...trade, entry_time: date})}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
        </div>

        {/* --- Exit Section (Conditionally Rendered) --- */}
        {isClosed && (
            <div className="col-span-2 grid grid-cols-2 gap-3 bg-red-500/5 p-2 rounded-md border border-red-500/20 animate-in slide-in-from-top-2">
                <div className="col-span-2 text-[10px] font-bold text-red-500/70 uppercase tracking-wider">Exit Details</div>
                
                {/* Exit Price */}
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Exit Price</Label>
                    <Input 
                        type="number" 
                        step="any"
                        value={trade.exit_price} 
                        onChange={(e) => setTrade({...trade, exit_price: parseFloat(e.target.value)})}
                        className="h-8 text-sm font-mono bg-background"
                    />
                </div>

                {/* Exit Time */}
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Exit Time</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-full justify-start text-left font-normal text-xs px-2 bg-background">
                            <CalendarIcon className="mr-2 h-3 w-3 opacity-50" />
                            {trade.exit_time ? format(trade.exit_time, "MMM d") : <span>Pick date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={trade.exit_time}
                            onSelect={(date) => date && setTrade({...trade, exit_time: date})}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        )}

        {/* --- Notes Section (Added) --- */}
        <div className="col-span-2 space-y-1">
            <Label className="text-xs text-muted-foreground">Notes / Thoughts</Label>
            <Textarea 
                value={trade.notes} 
                onChange={(e) => setTrade({...trade, notes: e.target.value})}
                placeholder="Why did you take this trade?"
                className="min-h-[60px] text-xs resize-none"
            />
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 hover:bg-destructive/10 hover:text-destructive h-9" 
          onClick={onCancel}
        >
          Discard
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-9 shadow-sm" 
          onClick={handleSave} 
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
          {loading ? "Saving..." : (isClosed ? "Log Closed Trade" : "Log Open Trade")}
        </Button>
      </div>
    </Card>
  );
};