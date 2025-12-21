// frontend/src/components/analytics/StrategyAnalysis.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext"; // ✅ Import Context

interface Props {
  strategies: any[];
  monthlyPerf: any[];
}

export const StrategyAnalysis = ({ strategies, monthlyPerf }: Props) => {
  const { format, convert, currency } = useCurrency(); // ✅ Use Hook
  
  const bestStrategy = strategies.length > 0 ? strategies[0].name : "N/A";
  const totalPnL = strategies.reduce((sum, s) => sum + s.pnl, 0);

  // ✅ Convert Monthly Perf Data for Chart
  const convertedMonthlyPerf = monthlyPerf.map(item => {
    const newItem = { ...item };
    Object.keys(newItem).forEach(key => {
      if (key !== 'month') {
        newItem[key] = convert(newItem[key]);
      }
    });
    return newItem;
  });

  // Colors for the monthly chart
  const STRAT_COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(180, 70%, 50%)", "hsl(45, 90%, 50%)", "#8884d8"];
  const stratNames = strategies.map(s => s.name).slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">STRATEGIES</p>
          <p className="text-2xl font-bold">{strategies.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">BEST STRATEGY</p>
          <p className="text-2xl font-bold text-success">{bestStrategy}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">AVG WIN RATE</p>
          <p className="text-2xl font-bold">{strategies.length > 0 ? (strategies.reduce((acc, s) => acc + s.winRate, 0) / strategies.length).toFixed(0) : 0}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">TOTAL P&L ({currency})</p>
          <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
             {format(totalPnL)}
          </p>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">STRATEGY LEADERBOARD</h3>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Ranked by P&L</span>
        </div>
        <div className="space-y-3">
          {strategies.map((strategy, index) => (
            <div key={strategy.name} className="p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
                  <span className="text-sm sm:text-base font-semibold">{strategy.name}</span>
                  {strategy.pnl > 0 ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                </div>
                <span className={`text-sm sm:text-lg font-bold ${strategy.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                   {format(strategy.pnl)}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-[10px] sm:text-xs">
                <div>Trades: <span className="font-semibold">{strategy.trades}</span></div>
                <div>Win Rate: <span className={strategy.winRate >= 50 ? "text-success" : "text-destructive"}>{strategy.winRate}%</span></div>
                <div>Max DD: <span className="text-destructive">{format(Math.abs(strategy.maxDrawdown))}</span></div>
                <div>Profit Factor: <span>{strategy.profitFactor}</span></div>
              </div>
              <Progress value={strategy.winRate} className="h-1.5 mt-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Performance by Strategy */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">MONTHLY PERFORMANCE BY STRATEGY</h3>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={convertedMonthlyPerf}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <Tooltip 
               contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} 
               formatter={(val: number) => format(val)}
            />
            {stratNames.map((name, i) => (
              <Bar key={name} dataKey={name} fill={STRAT_COLORS[i % STRAT_COLORS.length]} radius={[4, 4, 0, 0]} stackId="a" />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 justify-center mt-3">
          {stratNames.map((name, i) => (
            <Badge key={name} variant="secondary" className="text-[10px]">
              <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: STRAT_COLORS[i % STRAT_COLORS.length] }} />{name}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};