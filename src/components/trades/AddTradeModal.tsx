// frontend/src/components/trades/AddTradeModal.tsx
import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { api, Strategy, InstrumentType, TradeDirection, TradeStatus } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface AddTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTradeModal = ({ open, onOpenChange }: AddTradeModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  
  // State
  const [loading, setLoading] = useState(false);
  const [isClosed, setIsClosed] = useState(false); // Toggle for Open vs Closed trade
  
  const [formData, setFormData] = useState({
    symbol: "",
    instrument_type: "STOCK" as InstrumentType,
    direction: "Long" as TradeDirection,
    entry_price: "",
    quantity: "",
    entry_date: new Date(),
    // Exit fields (optional/conditional)
    exit_price: "",
    exit_date: new Date(),
    stop_loss: "",
    target: "",
    strategy_id: "none",
    notes: "",
  });

  // Load Strategies on mount
  useEffect(() => {
    if (open) {
      api.strategies.getAll()
        .then(data => setStrategies(data || []))
        .catch(err => console.error("Failed to load strategies", err));
    }
  }, [open]);

  // Mutation
  const createTradeMutation = useMutation({
    mutationFn: async () => {
      // 1. Validation
      if (!formData.symbol || !formData.entry_price || !formData.quantity) {
        throw new Error("Please fill in Symbol, Price, and Quantity.");
      }
      
      const entryPrice = parseFloat(formData.entry_price);
      const quantity = parseFloat(formData.quantity);
      
      if (isNaN(entryPrice) || entryPrice <= 0) throw new Error("Entry price must be positive.");
      if (isNaN(quantity) || quantity <= 0) throw new Error("Quantity must be positive.");

      // 2. Prepare Payload
      const payload = {
        symbol: formData.symbol.toUpperCase(),
        instrument_type: formData.instrument_type,
        direction: formData.direction,
        status: (isClosed ? "CLOSED" : "OPEN") as TradeStatus,
        entry_price: entryPrice,
        quantity: quantity,
        entry_time: formData.entry_date.toISOString(),
        
        // Conditional Fields
        exit_price: isClosed && formData.exit_price ? parseFloat(formData.exit_price) : undefined,
        exit_time: isClosed ? formData.exit_date.toISOString() : undefined,
        
        stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : undefined,
        target: formData.target ? parseFloat(formData.target) : undefined,
        strategy_id: formData.strategy_id === "none" ? undefined : formData.strategy_id,
        notes: formData.notes
      };

      // 3. Date Safety Check
      if (isClosed && payload.exit_time && new Date(payload.exit_time) < new Date(payload.entry_time)) {
        throw new Error("Exit time cannot be before Entry time.");
      }

      return api.trades.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); // If you have dashboard stats
      toast({ title: "Success", description: "Trade logged successfully." });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTradeMutation.mutate();
  };

  const resetForm = () => {
    setFormData({
      symbol: "",
      instrument_type: "STOCK",
      direction: "Long",
      entry_price: "",
      quantity: "",
      entry_date: new Date(),
      exit_price: "",
      exit_date: new Date(),
      stop_loss: "",
      target: "",
      strategy_id: "none",
      notes: "",
    });
    setIsClosed(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Manual Trade</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          
          {/* Top Row: Symbol & Instrument */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Symbol</Label>
              <Input
                placeholder="AAPL, BTC..."
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                className="uppercase font-bold"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Market</Label>
              <Select
                value={formData.instrument_type}
                onValueChange={(val: InstrumentType) => setFormData({ ...formData, instrument_type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK">Stock</SelectItem>
                  <SelectItem value="CRYPTO">Crypto</SelectItem>
                  <SelectItem value="FOREX">Forex</SelectItem>
                  <SelectItem value="FUTURES">Futures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Direction & Status Toggle */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select
                value={formData.direction}
                onValueChange={(val: TradeDirection) => setFormData({ ...formData, direction: val })}
              >
                <SelectTrigger className={formData.direction === "Long" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Long" className="text-green-600">Long 🟢</SelectItem>
                  <SelectItem value="Short" className="text-red-600">Short 🔴</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between border rounded-md p-2 h-10">
               <Label className="text-xs cursor-pointer" htmlFor="status-switch">Trade Closed?</Label>
               <Switch 
                  id="status-switch" 
                  checked={isClosed} 
                  onCheckedChange={setIsClosed} 
               />
            </div>
          </div>

          {/* Entry Details */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border/50 space-y-3">
             <Label className="text-xs font-semibold text-muted-foreground uppercase">Entry Details</Label>
             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={formData.entry_price}
                    onChange={(e) => setFormData({ ...formData, entry_price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label className="text-xs">Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {format(formData.entry_date, "PPP HH:mm")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.entry_date}
                        onSelect={(date) => date && setFormData({ ...formData, entry_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
             </div>
          </div>

          {/* Exit Details (Conditional) */}
          {isClosed && (
            <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10 space-y-3 animate-in slide-in-from-top-2">
               <Label className="text-xs font-semibold text-red-500/70 uppercase">Exit Details</Label>
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Exit Price</Label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={formData.exit_price}
                      onChange={(e) => setFormData({ ...formData, exit_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Exit Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal text-sm">
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                          {format(formData.exit_date, "PPP HH:mm")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.exit_date}
                          onSelect={(date) => date && setFormData({ ...formData, exit_date: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
               </div>
            </div>
          )}

          {/* Strategy & Notes */}
          <div className="space-y-2">
            <Label>Strategy</Label>
            <Select
              value={formData.strategy_id}
              onValueChange={(val) => setFormData({ ...formData, strategy_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a playbook..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Strategy</SelectItem>
                {strategies.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Trade rationale, market conditions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="resize-none min-h-[80px]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTradeMutation.isPending}>
              {createTradeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log Trade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};