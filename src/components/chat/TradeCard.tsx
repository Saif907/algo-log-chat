import { TrendingUp, TrendingDown, Calendar, Clock, Target, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TradeCardProps {
  trade: {
    symbol: string;
    side: "long" | "short";
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    pnl: number;
    rMultiple?: number;
    entryDate: string;
    exitDate?: string;
    strategy?: string;
    notes?: string;
  };
}

export const TradeCard = ({ trade }: TradeCardProps) => {
  const isProfit = trade.pnl >= 0;
  const pnlPercentage = ((trade.exitPrice - trade.entryPrice) / trade.entryPrice * 100 * (trade.side === "long" ? 1 : -1)).toFixed(2);

  return (
    <Card className={`p-4 border-l-4 ${isProfit ? 'border-l-green-500 bg-green-500/5' : 'border-l-red-500 bg-red-500/5'}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{trade.symbol}</span>
            <Badge variant={trade.side === "long" ? "default" : "destructive"} className="text-xs">
              {trade.side.toUpperCase()}
            </Badge>
          </div>
          <div className={`flex items-center gap-1 font-bold text-lg ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
            {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            ₹{Math.abs(trade.pnl).toLocaleString()}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Entry Price</p>
            <p className="font-medium">₹{trade.entryPrice.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Exit Price</p>
            <p className="font-medium">₹{trade.exitPrice.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Quantity</p>
            <p className="font-medium">{trade.quantity}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Return</p>
            <p className={`font-medium ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isProfit ? '+' : ''}{pnlPercentage}%
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {trade.entryDate}
          </div>
          {trade.rMultiple && (
            <Badge variant="outline" className="text-xs">
              {trade.rMultiple > 0 ? '+' : ''}{trade.rMultiple}R
            </Badge>
          )}
          {trade.strategy && (
            <Badge variant="secondary" className="text-xs">
              {trade.strategy}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};
