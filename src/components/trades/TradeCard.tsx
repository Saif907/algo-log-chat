import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Heart, Calendar, Clock } from "lucide-react";

interface TradeCardProps {
  trade: {
    id: number;
    symbol: string;
    direction: string;
    instrument: string;
    account: string;
    entry: { date: string; time: string; price: number };
    exit: { date: string; time: string; price: number };
    holdingTime: string;
    pl: number;
    rMultiple: number;
    returnPct: number;
    playbook: string;
    mistakes: number;
    notes: number;
    tags: string[];
  };
  onClick?: () => void;
}

export const TradeCard = ({ trade, onClick }: TradeCardProps) => {
  return (
    <Card 
      className={`p-4 bg-card space-y-3 cursor-pointer transition-all ${
        trade.pl > 0 
          ? 'border-l-4 border-l-success hover:bg-success/5' 
          : 'border-l-4 border-l-destructive hover:bg-destructive/5'
      }`} 
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-lg">{trade.symbol}</div>
          <div className="text-xs text-muted-foreground">{trade.entry.date} • {trade.entry.time}</div>
        </div>
        <Badge 
          variant="outline"
          className={trade.direction === "Long" 
            ? "bg-success/10 text-success border-success/30" 
            : "bg-destructive/10 text-destructive border-destructive/30"
          }
        >
          {trade.direction}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">P/L</p>
          <p className={`font-semibold text-lg ${trade.pl > 0 ? "text-success" : "text-destructive"}`}>
            {trade.pl > 0 ? "+" : ""}${trade.pl.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">R-Multiple</p>
          <p className={`font-semibold text-lg ${trade.rMultiple > 0 ? "text-success" : "text-destructive"}`}>
            {trade.rMultiple > 0 ? "+" : ""}{trade.rMultiple.toFixed(1)}R
          </p>
        </div>
      </div>

      <div className="border-t border-border/50 pt-3">
        <div className="flex items-center gap-1.5 mb-2">
          {trade.playbook !== "No playbook" && (
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          )}
          <span className={`text-sm ${trade.playbook === "No playbook" ? "text-muted-foreground" : ""}`}>
            {trade.playbook}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {trade.tags.slice(0, 3).map((tag, idx) => (
            <Badge 
              key={idx} 
              variant="secondary" 
              className="text-xs bg-muted/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
