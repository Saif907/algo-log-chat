import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts";
import { Edit, Trash2, Copy, Upload, X, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { EditTradeModal } from "@/components/trades/EditTradeModal";

const mockTrade = {
  id: "1",
  symbol: "ES",
  date: "Nov 27, 2024",
  time: "09:30 AM",
  direction: "LONG" as const,
  status: "Closed" as const,
  pnl: 450.00,
  rMultiple: 2.5,
  entry: 4580.50,
  exit: 4585.00,
  stopLoss: 4578.75,
  target: 4587.25,
  riskReward: 2.5,
  risk: 180.00,
  reward: 450.00,
  quantity: 2,
  holdingTime: "45 minutes",
  fees: 4.80,
  netPnl: 445.20,
  notes: "Clean breakout setup above resistance. Volume confirmed the move. Entry was textbook.",
  tags: ["Breakout", "ES", "Morning Session", "High Volume"],
  screenshots: [
    { id: "1", name: "entry-chart.png", url: "/placeholder.svg" },
    { id: "2", name: "exit-chart.png", url: "/placeholder.svg" },
  ],
  playbook: "Breakout Strategy",
  emotion: "Confident",
  mistakes: [],
};

const chartData = [
  { time: "09:25", price: 4579.00 },
  { time: "09:30", price: 4580.50 },
  { time: "09:35", price: 4581.75 },
  { time: "09:40", price: 4583.50 },
  { time: "09:45", price: 4582.25 },
  { time: "09:50", price: 4584.00 },
  { time: "10:00", price: 4585.00 },
  { time: "10:05", price: 4586.25 },
  { time: "10:10", price: 4584.50 },
  { time: "10:15", price: 4585.75 },
];

const relatedTrades = [
  { id: "2", symbol: "ES", direction: "LONG", pnl: 250.00, date: "Nov 26" },
  { id: "3", symbol: "ES", direction: "SHORT", pnl: -180.00, date: "Nov 25" },
  { id: "4", symbol: "ES", direction: "LONG", pnl: 320.00, date: "Nov 24" },
];

export const TradeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trade = mockTrade;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isProfitable = trade.pnl >= 0;
  
  const tradeForEdit = {
    id: parseInt(trade.id),
    symbol: trade.symbol,
    side: trade.direction.toLowerCase(),
    entryPrice: trade.entry,
    exitPrice: trade.exit,
    quantity: trade.quantity,
    entryDate: "2024-11-27T09:30",
    exitDate: "2024-11-27T10:15",
    stopLoss: trade.stopLoss,
    target: trade.target,
    strategy: "breakout",
    emotionalState: trade.emotion.toLowerCase(),
    notes: trade.notes,
    tags: trade.tags,
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-8">
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
              <Badge variant={trade.direction === "LONG" ? "default" : "destructive"} className={
                trade.direction === "LONG" 
                  ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30" 
                  : "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
              }>
                {trade.direction}
              </Badge>
              <Badge variant="outline">{trade.status}</Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">{trade.date} • {trade.time}</p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">NET P&L</p>
              <p className={`text-2xl sm:text-3xl font-bold ${isProfitable ? "text-success" : "text-destructive"}`}>
                ${isProfitable ? "+" : ""}{trade.pnl.toFixed(2)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">R: {trade.rMultiple}R</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => setIsEditOpen(true)}>
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="destructive" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <EditTradeModal open={isEditOpen} onOpenChange={setIsEditOpen} trade={tradeForEdit} />

      {/* Chart Section */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">PRICE ACTION</h3>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <ReferenceLine y={trade.entry} stroke="hsl(var(--primary))" strokeDasharray="3 3" />
            <ReferenceLine y={trade.exit} stroke="hsl(var(--success))" strokeDasharray="3 3" />
            <ReferenceLine y={trade.stopLoss} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
            <ReferenceDot x="09:30" y={trade.entry} r={5} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={2} />
            <ReferenceDot x="10:00" y={trade.exit} r={5} fill="hsl(var(--success))" stroke="hsl(var(--background))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Trade Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">ENTRY</p>
          <p className="text-lg sm:text-2xl font-bold">${trade.entry.toFixed(2)}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">EXIT</p>
          <p className="text-lg sm:text-2xl font-bold">${trade.exit.toFixed(2)}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">STOP LOSS</p>
          <p className="text-lg sm:text-2xl font-bold">${trade.stopLoss.toFixed(2)}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">TARGET</p>
          <p className="text-lg sm:text-2xl font-bold">${trade.target.toFixed(2)}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">R : R</p>
          <p className="text-lg sm:text-2xl font-bold">1:{trade.riskReward}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">RISK</p>
          <p className="text-lg sm:text-2xl font-bold text-destructive">${trade.risk.toFixed(2)}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">QUANTITY</p>
          <p className="text-lg sm:text-2xl font-bold">{trade.quantity}</p>
        </Card>

        <Card className="p-3 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">HOLD TIME</p>
          <p className="text-lg sm:text-2xl font-bold">{trade.holdingTime}</p>
        </Card>
      </div>

      {/* Notes and Screenshots Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">TRADE NOTES</h3>
          <Textarea 
            defaultValue={trade.notes}
            placeholder="Add your trade notes here..."
            className="min-h-[120px] sm:min-h-[200px] resize-none text-sm"
          />
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">SCREENSHOTS</h3>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Upload
            </Button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {trade.screenshots.map((screenshot) => (
              <div key={screenshot.id} className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background rounded overflow-hidden">
                    <img src={screenshot.url} alt={screenshot.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-none">{screenshot.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tags and Emotion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {trade.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">EMOTIONAL STATE</h3>
          <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
            {trade.emotion}
          </Badge>
        </Card>
      </div>

      {/* Related Trades */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">RELATED TRADES</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/trades')} className="text-xs">
            View All
          </Button>
        </div>
        <div className="space-y-2">
          {relatedTrades.map((relatedTrade) => (
            <div 
              key={relatedTrade.id} 
              className="flex items-center justify-between py-2.5 sm:py-3 hover:bg-muted/50 rounded px-2 cursor-pointer transition-colors"
              onClick={() => navigate(`/trades/${relatedTrade.id}`)}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-sm font-medium">{relatedTrade.symbol}</span>
                <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded ${
                  relatedTrade.direction === "LONG" 
                    ? "bg-cyan-500/20 text-cyan-400" 
                    : "bg-pink-500/20 text-pink-400"
                }`}>
                  {relatedTrade.direction}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm text-muted-foreground">{relatedTrade.date}</span>
                <span className={`text-sm font-semibold ${
                  relatedTrade.pnl >= 0 ? "text-success" : "text-destructive"
                }`}>
                  ${relatedTrade.pnl >= 0 ? "+" : ""}{Math.abs(relatedTrade.pnl).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
