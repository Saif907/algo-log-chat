// frontend/src/components/calendar/DayHoverCard.tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext"; // ✅ Import Context

interface DayData {
  trades: number;
  pnl: number;
  winRate?: number;
  bestStrategy?: string;
}

interface DayHoverCardProps {
  day: number;
  data: DayData;
  children: React.ReactNode;
}

export const DayHoverCard = ({ day, data, children }: DayHoverCardProps) => {
  const { format } = useCurrency(); // ✅ Use Hook
  const isProfit = data.pnl >= 0;

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side="top" 
        align="center"
        className="w-64 p-4 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Day {day}</h4>
            {isProfit ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total P/L</span>
              <span className={isProfit ? "text-success font-semibold" : "text-destructive font-semibold"}>
                 {/* ✅ Use format */}
                {isProfit ? "+" : "-"}{format(Math.abs(data.pnl))}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground"># of Trades</span>
              <span className="font-medium">{data.trades}</span>
            </div>
            
            {data.winRate !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Rate</span>
                <span className={`font-medium ${data.winRate >= 50 ? "text-success" : "text-muted-foreground"}`}>
                  {data.winRate}%
                </span>
              </div>
            )}
            
            {data.bestStrategy && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Strategy</span>
                <span className="font-medium truncate ml-2 max-w-[100px]" title={data.bestStrategy}>
                  {data.bestStrategy}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};