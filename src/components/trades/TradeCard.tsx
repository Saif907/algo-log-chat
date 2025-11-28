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
  };
  onClick?: () => void;
}

export const TradeCard = ({ trade, onClick }: TradeCardProps) => {
  return (
    <Card className="p-4 bg-card border-border/50 space-y-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg">{trade.symbol}</span>
          <Copy className="h-3 w-3 text-muted-foreground cursor-pointer" />
        </div>
        <Badge className="bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 border-[#00d4ff]/50">
          {trade.direction}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Instrument</p>
          <p className="font-medium">{trade.instrument}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Account</p>
          <p className="font-medium">{trade.account}</p>
        </div>
      </div>

      <div className="border-t border-border/50 pt-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-muted-foreground text-xs mb-1">Entry</p>
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              {trade.entry.date}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {trade.entry.time} @ ${trade.entry.price}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-xs mb-1">Exit</p>
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              {trade.exit.date}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {trade.exit.time} @ ${trade.exit.price}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 pt-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">P/L</p>
            <p className={`font-semibold ${trade.pl > 0 ? "text-success" : "text-destructive"}`}>
              {trade.pl > 0 ? "+" : ""}${trade.pl.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">R-Multiple</p>
            <p className={`font-semibold ${trade.rMultiple > 0 ? "text-success" : "text-destructive"}`}>
              {trade.rMultiple > 0 ? "+" : ""}{trade.rMultiple.toFixed(1)}R
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Return</p>
            <p className={`font-semibold ${trade.returnPct > 0 ? "text-success" : "text-destructive"}`}>
              {trade.returnPct > 0 ? "+" : ""}{trade.returnPct.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 pt-3 space-y-2">
        <div className="flex items-center gap-1">
          {trade.playbook !== "No playbook" && <div className="w-2 h-2 rounded-full bg-primary" />}
          <span className={`text-sm ${trade.playbook === "No playbook" ? "text-muted-foreground" : ""}`}>
            {trade.playbook}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            <span className="text-[#00d4ff]">⚡</span> Plan
          </Badge>
          {trade.mistakes > 0 && (
            <Badge variant="destructive" className="text-xs">
              {trade.mistakes} mistakes
            </Badge>
          )}
          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Heart className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground">{trade.notes} notes</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
