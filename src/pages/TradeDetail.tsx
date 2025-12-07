import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts";
import { Edit, Trash2, Copy, Upload, X, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EditTradeModal } from "@/components/trades/EditTradeModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Placeholder data for the chart line (since we don't have historical market data API yet)
const mockChartData = [
  { time: "09:25", price: 0 },
  { time: "09:30", price: 0 },
  { time: "09:35", price: 0 },
  { time: "10:00", price: 0 },
  { time: "10:15", price: 0 },
];

export const TradeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trade, setTrade] = useState<any>(null);
  const [relatedTrades, setRelatedTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // 1. Helper Calculations
  const calculateHoldingTime = (start: string, end: string | null) => {
    if (!end) return "Open";
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const calculateRisk = (entry: number, stop: number | null, qty: number) => {
    if (!stop) return 0;
    return Math.abs(entry - stop) * qty;
  };

  const calculateRMultiple = (pnl: number, risk: number) => {
    if (!risk || risk === 0) return 0;
    return (pnl / risk).toFixed(2);
  };

  // 2. Fetch Data
  useEffect(() => {
    const fetchTradeData = async () => {
      if (!id) return;
      setLoading(true);

      // A. Fetch Main Trade
      const { data: tradeData, error } = await supabase
        .from('trades')
        .select('*, strategies(name)')
        .eq('id', id)
        .single();
      
      if (error) {
        toast({ title: "Error", description: "Could not fetch trade", variant: "destructive" });
        navigate('/trades');
        return;
      }

      // B. Fetch Related Trades (Same Symbol, different ID)
      if (tradeData) {
        const { data: related } = await supabase
          .from('trades')
          .select('id, symbol, direction, pnl, entry_time')
          .eq('symbol', tradeData.symbol)
          .neq('id', tradeData.id)
          .limit(3)
          .order('entry_time', { ascending: false });
        
        setRelatedTrades(related || []);
      }

      setTrade(tradeData);
      setLoading(false);
    };

    fetchTradeData();
  }, [id, navigate, toast]);

  // 3. Handle Delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this trade?")) return;
    const { error } = await supabase.from('trades').delete().eq('id', id);
    if (!error) {
      toast({ title: "Deleted", description: "Trade deleted successfully" });
      navigate('/trades');
    }
  };

  if (loading) return <div className="p-8"><Skeleton className="h-[600px] w-full" /></div>;
  if (!trade) return null;

  // 4. Derived Values for UI
  const riskAmount = calculateRisk(trade.entry_price, trade.stop_loss, trade.quantity);
  const rMultiple = calculateRMultiple(trade.pnl || 0, riskAmount);
  const holdingTime = calculateHoldingTime(trade.entry_time, trade.exit_time);
  const isProfitable = (trade.pnl || 0) >= 0;

  // Generate chart data that looks relative to the entry price for visualization
  const dynamicChartData = mockChartData.map(d => ({
    ...d,
    price: trade.entry_price + (Math.random() * (trade.entry_price * 0.02) - (trade.entry_price * 0.01))
  }));

  // Prepare object for Edit Modal
  const tradeForEdit = {
    id: trade.id,
    symbol: trade.symbol,
    side: trade.direction.toLowerCase(),
    entryPrice: trade.entry_price,
    exitPrice: trade.exit_price || 0,
    quantity: trade.quantity,
    entryDate: trade.entry_time,
    exitDate: trade.exit_time || "",
    notes: trade.encrypted_notes || "",
    stopLoss: trade.stop_loss,
    target: trade.target,
    strategyId: trade.strategy_id,
    emotion: trade.emotion,
    tags: trade.tags || [],
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20">
      {/* Back Button - Mobile */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/trades')}
        className="md:hidden -ml-2 mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Trades
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">{trade.symbol}</h1>
              {/* Original Rich Styling for Badges */}
              <Badge 
                variant="outline" 
                className={
                  trade.direction === "LONG" 
                    ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-cyan-500/30" 
                    : "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 border-pink-500/30"
                }
              >
                {trade.direction}
              </Badge>
              <Badge variant="outline">{trade.status}</Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
                {new Date(trade.entry_time).toLocaleDateString()} • {new Date(trade.entry_time).toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">NET P&L</p>
              <p className={`text-2xl sm:text-3xl font-bold ${isProfitable ? "text-success" : "text-destructive"}`}>
                ${isProfitable ? "+" : ""}{trade.pnl?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                R: {rMultiple}R
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsEditOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <EditTradeModal 
        open={isEditOpen} 
        onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) window.location.reload();
        }} 
        trade={tradeForEdit} 
      />

      {/* Chart Section (Restored Visuals) */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">PRICE ACTION</h3>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
          <LineChart data={dynamicChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis domain={['auto', 'auto']} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            
            {/* Real Data Lines */}
            <ReferenceLine y={trade.entry_price} stroke="hsl(var(--primary))" strokeDasharray="3 3" label="Entry" />
            {trade.exit_price && <ReferenceLine y={trade.exit_price} stroke="hsl(var(--success))" strokeDasharray="3 3" label="Exit" />}
            {trade.stop_loss && <ReferenceLine y={trade.stop_loss} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="SL" />}
            {trade.target && <ReferenceLine y={trade.target} stroke="hsl(var(--foreground))" strokeDasharray="3 3" label="TP" />}
            
            <Line type="monotone" dataKey="price" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Metrics Grid (Restored) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">ENTRY</p>
          <p className="text-lg sm:text-2xl font-bold">${trade.entry_price}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">EXIT</p>
          <p className="text-lg sm:text-2xl font-bold">${trade.exit_price || "-"}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">STOP LOSS</p>
          <p className="text-lg sm:text-2xl font-bold">${trade.stop_loss || "-"}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">TARGET</p>
          <p className="text-lg sm:text-2xl font-bold">${trade.target || "-"}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">R : R</p>
          <p className="text-lg sm:text-2xl font-bold">1:{rMultiple}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">RISK</p>
          <p className="text-lg sm:text-2xl font-bold text-destructive">${riskAmount.toFixed(2)}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">QUANTITY</p>
          <p className="text-lg sm:text-2xl font-bold">{trade.quantity}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">HOLD TIME</p>
          <p className="text-lg sm:text-2xl font-bold">{holdingTime}</p>
        </Card>
      </div>

      {/* Notes and Screenshots Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">TRADE NOTES</h3>
          <div className="bg-muted/30 p-4 rounded-lg min-h-[200px] text-sm whitespace-pre-wrap">
            {trade.encrypted_notes || "No notes added for this trade."}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">SCREENSHOTS</h3>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsEditOpen(true)}>
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Upload
            </Button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {trade.encrypted_screenshots && trade.encrypted_screenshots.length > 0 ? (
              trade.encrypted_screenshots.map((url: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <div className="w-16 h-16 bg-background rounded overflow-hidden flex-shrink-0">
                      <a href={url} target="_blank" rel="noreferrer">
                        <img src={url} alt={`Screenshot ${index}`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                      </a>
                    </div>
                    <span className="text-xs sm:text-sm font-medium truncate">Chart Image {index + 1}</span>
                  </div>
                </div>
              ))
            ) : (
               <div className="flex flex-col items-center justify-center h-[150px] text-muted-foreground border-2 border-dashed rounded-lg">
                 <p>No screenshots</p>
               </div>
            )}
          </div>
        </Card>
      </div>

      {/* Tags and Emotion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">TAGS & STRATEGY</h3>
          <div className="space-y-4">
             <div className="flex flex-wrap gap-2">
                {trade.tags && trade.tags.length > 0 ? trade.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
                    {tag}
                </Badge>
                )) : <span className="text-sm text-muted-foreground">No tags</span>}
            </div>
            <div>
                <p className="text-xs text-muted-foreground mb-1">STRATEGY</p>
                <p className="font-medium">{trade.strategies?.name || "No Strategy Linked"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">EMOTIONAL STATE</h3>
          <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
            {trade.emotion || "Not Logged"}
          </Badge>
        </Card>
      </div>

      {/* Related Trades (Restored with Real Data) */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">RELATED TRADES ({trade.symbol})</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/trades')} className="text-xs">
            View All
          </Button>
        </div>
        <div className="space-y-2">
          {relatedTrades.length > 0 ? relatedTrades.map((relatedTrade) => (
            <div 
              key={relatedTrade.id} 
              className="flex items-center justify-between py-2.5 sm:py-3 hover:bg-muted/50 rounded px-2 cursor-pointer transition-colors"
              onClick={() => navigate(`/trades/${relatedTrade.id}`)}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-sm font-medium">{relatedTrade.symbol}</span>
                <Badge variant="outline" className={
                   relatedTrade.direction === "LONG" 
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" 
                    : "bg-pink-500/20 text-pink-400 border-pink-500/30"
                }>
                  {relatedTrade.direction}
                </Badge>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm text-muted-foreground">
                    {new Date(relatedTrade.entry_time).toLocaleDateString()}
                </span>
                <span className={`text-sm font-semibold ${
                  (relatedTrade.pnl || 0) >= 0 ? "text-success" : "text-destructive"
                }`}>
                  ${(relatedTrade.pnl || 0) >= 0 ? "+" : ""}{Math.abs(relatedTrade.pnl || 0).toFixed(2)}
                </span>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground py-2">No other trades for this symbol.</p>
          )}
        </div>
      </Card>
    </div>
  );
};