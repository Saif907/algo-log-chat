import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts";
import { Edit, Trash2, Copy, Upload, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// Mock trade data - replace with actual data fetching
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

// Mock chart data with entry/exit
const chartData = [
  { time: "09:25", price: 4579.00 },
  { time: "09:30", price: 4580.50 }, // Entry
  { time: "09:35", price: 4581.75 },
  { time: "09:40", price: 4583.50 },
  { time: "09:45", price: 4582.25 },
  { time: "09:50", price: 4584.00 },
  { time: "10:00", price: 4585.00 }, // Exit
  { time: "10:05", price: 4586.25 },
  { time: "10:10", price: 4584.50 },
  { time: "10:15", price: 4585.75 },
];

// Mock related trades
const relatedTrades = [
  { id: "2", symbol: "ES", direction: "LONG", pnl: 250.00, date: "Nov 26" },
  { id: "3", symbol: "ES", direction: "SHORT", pnl: -180.00, date: "Nov 25" },
  { id: "4", symbol: "ES", direction: "LONG", pnl: 320.00, date: "Nov 24" },
];

export const TradeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trade = mockTrade; // Replace with actual data fetching based on id

  const isProfitable = trade.pnl >= 0;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{trade.symbol}</h1>
            <Badge variant={trade.direction === "LONG" ? "default" : "destructive"} className={
              trade.direction === "LONG" 
                ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30" 
                : "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
            }>
              {trade.direction}
            </Badge>
            <Badge variant="outline">{trade.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{trade.date} • {trade.time}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">NET P&L</p>
            <p className={`text-3xl font-bold ${isProfitable ? "text-success" : "text-destructive"}`}>
              ${isProfitable ? "+" : ""}{trade.pnl.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">R-Multiple: {trade.rMultiple}R</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold mb-4">PRICE ACTION</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(var(--muted-foreground))" />
            <ReferenceLine y={trade.entry} stroke="hsl(var(--primary))" strokeDasharray="3 3" label={{ value: 'Entry', fill: 'hsl(var(--primary))', fontSize: 12 }} />
            <ReferenceLine y={trade.exit} stroke="hsl(var(--success))" strokeDasharray="3 3" label={{ value: 'Exit', fill: 'hsl(var(--success))', fontSize: 12 }} />
            <ReferenceLine y={trade.stopLoss} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: 'Stop Loss', fill: 'hsl(var(--destructive))', fontSize: 12 }} />
            <ReferenceLine y={trade.target} stroke="hsl(var(--accent))" strokeDasharray="3 3" label={{ value: 'Target', fill: 'hsl(var(--accent))', fontSize: 12 }} />
            <Line type="monotone" dataKey="price" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
            <ReferenceDot x="09:30" y={trade.entry} r={6} fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth={2} />
            <ReferenceDot x="10:00" y={trade.exit} r={6} fill="hsl(var(--success))" stroke="hsl(var(--background))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Trade Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">ENTRY</p>
          <p className="text-2xl font-bold">${trade.entry.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">EXIT</p>
          <p className="text-2xl font-bold">${trade.exit.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">STOP LOSS</p>
          <p className="text-2xl font-bold">${trade.stopLoss.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">TARGET</p>
          <p className="text-2xl font-bold">${trade.target.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">RISK : REWARD</p>
          <p className="text-2xl font-bold">1 : {trade.riskReward}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">RISK</p>
          <p className="text-2xl font-bold text-destructive">${trade.risk.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">REWARD</p>
          <p className="text-2xl font-bold text-success">${trade.reward.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">QUANTITY</p>
          <p className="text-2xl font-bold">{trade.quantity}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">HOLDING TIME</p>
          <p className="text-2xl font-bold">{trade.holdingTime}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">FEES</p>
          <p className="text-2xl font-bold">${trade.fees.toFixed(2)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">NET P&L</p>
          <p className={`text-2xl font-bold ${trade.netPnl >= 0 ? "text-success" : "text-destructive"}`}>
            ${trade.netPnl >= 0 ? "+" : ""}{trade.netPnl.toFixed(2)}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">PLAYBOOK</p>
          <p className="text-lg font-semibold">{trade.playbook}</p>
        </Card>
      </div>

      {/* Notes and Screenshots Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Notes Section */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">TRADE NOTES</h3>
          <Textarea 
            defaultValue={trade.notes}
            placeholder="Add your trade notes here..."
            className="min-h-[200px] resize-none"
          />
        </Card>

        {/* Screenshots Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">SCREENSHOTS</h3>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <div className="space-y-3">
            {trade.screenshots.map((screenshot) => (
              <div key={screenshot.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-background rounded overflow-hidden">
                    <img src={screenshot.url} alt={screenshot.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium">{screenshot.name}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {trade.screenshots.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No screenshots uploaded</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Tags and Emotion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {trade.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-4">EMOTIONAL STATE</h3>
          <Badge variant="outline" className="px-4 py-2 text-base">
            {trade.emotion}
          </Badge>
        </Card>
      </div>

      {/* Related Trades */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">RELATED TRADES ({trade.playbook})</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/trades')}>
            View All
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-2">
            <span className="w-20">SYMBOL</span>
            <span className="w-24">DIRECTION</span>
            <span className="w-20">DATE</span>
            <span className="w-20 text-right">P&L</span>
          </div>
          {relatedTrades.map((relatedTrade) => (
            <div 
              key={relatedTrade.id} 
              className="flex items-center justify-between py-3 hover:bg-muted/50 rounded cursor-pointer transition-colors"
              onClick={() => navigate(`/trades/${relatedTrade.id}`)}
            >
              <span className="w-20 text-sm font-medium">{relatedTrade.symbol}</span>
              <span className={`w-24 text-xs px-2 py-1 rounded ${
                relatedTrade.direction === "LONG" 
                  ? "bg-cyan-500/20 text-cyan-400" 
                  : "bg-pink-500/20 text-pink-400"
              }`}>
                {relatedTrade.direction}
              </span>
              <span className="w-20 text-sm text-muted-foreground">{relatedTrade.date}</span>
              <span className={`w-20 text-right text-sm font-semibold ${
                relatedTrade.pnl >= 0 ? "text-success" : "text-destructive"
              }`}>
                ${relatedTrade.pnl >= 0 ? "+" : ""}{Math.abs(relatedTrade.pnl).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
