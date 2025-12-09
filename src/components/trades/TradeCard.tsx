// frontend/src/components/trades/TradeCard.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  trade: {
    id: string;
    symbol: string;
    direction: string;
    instrument_type?: string;
    status: string;
    entry: { date: string; time: string; price: number };
    exit: { date: string; time: string; price: number };
    quantity: number;
    pl: number;
    rMultiple?: number;
    playbook?: string;
    tags?: string[];
  };
  onClick?: () => void;
}

export const TradeCard = ({ trade, onClick }: Props) => {
  const isWin = trade.pl >= 0;
  
  // Helper for safe currency display
  const fmtMoney = (val: number) => `$${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card 
      className="p-3 hover:bg-muted/50 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-primary"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-base">{trade.symbol}</span>
          {/* ✅ Instrument Badge */}
          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-5 font-medium">
            {trade.instrument_type || "STOCK"}
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-[10px] px-1 py-0 h-5 ${
              trade.direction === "LONG" 
                ? "bg-green-500/10 text-green-600 border-green-200" 
                : "bg-red-500/10 text-red-600 border-red-200"
            }`}
          >
            {trade.direction}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">{trade.entry.date}</span>
      </div>

      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            {trade.quantity} @ {trade.entry.price}
          </div>
          <div className="flex items-center gap-2">
             <Badge variant="secondary" className="text-[10px] font-normal bg-muted">
                {trade.playbook}
             </Badge>
          </div>
        </div>

        <div className="text-right">
          <div className={`font-bold text-sm flex items-center justify-end gap-1 ${isWin ? "text-success" : "text-destructive"}`}>
            {isWin ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {isWin ? "+" : "-"}{fmtMoney(trade.pl)}
          </div>
          {trade.rMultiple !== 0 && (
            <div className={`text-xs font-medium ${trade.rMultiple && trade.rMultiple > 0 ? "text-success" : "text-destructive"}`}>
              {trade.rMultiple && trade.rMultiple > 0 ? "+" : ""}{trade.rMultiple?.toFixed(1)}R
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};