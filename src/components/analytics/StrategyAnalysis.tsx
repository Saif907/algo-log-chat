import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

const strategyLeaderboard = [
  { 
    name: "Breakout Trading", 
    trades: 24, 
    winRate: 72, 
    pnl: 4250, 
    avgR: 2.1, 
    maxDrawdown: -850,
    profitFactor: 2.4
  },
  { 
    name: "Mean Reversion", 
    trades: 18, 
    winRate: 61, 
    pnl: 1820, 
    avgR: 1.5, 
    maxDrawdown: -620,
    profitFactor: 1.8
  },
  { 
    name: "Scalping", 
    trades: 35, 
    winRate: 58, 
    pnl: 980, 
    avgR: 0.8, 
    maxDrawdown: -450,
    profitFactor: 1.4
  },
  { 
    name: "Swing Trading", 
    trades: 12, 
    winRate: 67, 
    pnl: 2100, 
    avgR: 2.8, 
    maxDrawdown: -1200,
    profitFactor: 2.1
  },
  { 
    name: "News Trading", 
    trades: 8, 
    winRate: 38, 
    pnl: -650, 
    avgR: -0.6, 
    maxDrawdown: -1800,
    profitFactor: 0.7
  },
];

const strategyComparisonData = strategyLeaderboard.map(s => ({
  name: s.name.split(" ")[0],
  pnl: s.pnl,
  winRate: s.winRate
}));

const monthlyStrategyPerf = [
  { month: "Oct", breakout: 1200, meanReversion: 450, scalping: 280, swing: 850 },
  { month: "Nov", breakout: 1500, meanReversion: 620, scalping: 350, swing: 680 },
  { month: "Dec", breakout: 1550, meanReversion: 750, scalping: 350, swing: 570 },
];

export const StrategyAnalysis = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">STRATEGIES</p>
          <p className="text-xl sm:text-3xl font-bold">5</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">BEST STRATEGY</p>
          <p className="text-lg sm:text-2xl font-bold text-success">Breakout</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">AVG WIN RATE</p>
          <p className="text-xl sm:text-3xl font-bold">59%</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">TOTAL P&L</p>
          <p className="text-xl sm:text-3xl font-bold text-success">$8,500</p>
        </Card>
      </div>

      {/* Strategy Leaderboard */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">STRATEGY LEADERBOARD</h3>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Ranked by P&L</span>
        </div>
        <div className="space-y-3">
          {strategyLeaderboard
            .sort((a, b) => b.pnl - a.pnl)
            .map((strategy, index) => (
            <div key={strategy.name} className="p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className={`text-xs sm:text-sm font-bold ${
                    index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-orange-500" : "text-muted-foreground"
                  }`}>#{index + 1}</span>
                  <span className="text-sm sm:text-base font-semibold">{strategy.name}</span>
                  {strategy.pnl > 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <span className={`text-sm sm:text-lg font-bold ${strategy.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                  {strategy.pnl >= 0 ? "+" : ""}${strategy.pnl.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 text-[10px] sm:text-xs">
                <div>
                  <span className="text-muted-foreground">Trades</span>
                  <p className="font-semibold">{strategy.trades}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Win Rate</span>
                  <p className={`font-semibold ${strategy.winRate >= 50 ? "text-success" : "text-destructive"}`}>
                    {strategy.winRate}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg R</span>
                  <p className={`font-semibold ${strategy.avgR >= 0 ? "text-success" : "text-destructive"}`}>
                    {strategy.avgR}R
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Max DD</span>
                  <p className="font-semibold text-destructive">${Math.abs(strategy.maxDrawdown)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Profit Factor</span>
                  <p className={`font-semibold ${strategy.profitFactor >= 1 ? "text-success" : "text-destructive"}`}>
                    {strategy.profitFactor}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={strategy.winRate} className="h-1.5" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Strategy Comparison */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">P&L BY STRATEGY</h3>
          </div>
          <ResponsiveContainer width="100%" height={200} className="sm:h-[240px]">
            <BarChart data={strategyComparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={70} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                {strategyComparisonData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Win Rate by Strategy */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">WIN RATE BY STRATEGY</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {strategyLeaderboard.map((strategy) => (
              <div key={strategy.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium">{strategy.name}</span>
                  <span className={`text-xs sm:text-sm font-semibold ${strategy.winRate >= 50 ? "text-success" : "text-destructive"}`}>
                    {strategy.winRate}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${strategy.winRate >= 50 ? "bg-success" : "bg-destructive"}`}
                    style={{ width: `${strategy.winRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Performance by Strategy */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">MONTHLY PERFORMANCE BY STRATEGY</h3>
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[280px]">
          <BarChart data={monthlyStrategyPerf}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="breakout" name="Breakout" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="meanReversion" name="Mean Reversion" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="scalping" name="Scalping" fill="hsl(180, 70%, 50%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="swing" name="Swing" fill="hsl(45, 90%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 justify-center mt-3">
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-primary mr-1" />Breakout
          </Badge>
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-success mr-1" />Mean Reversion
          </Badge>
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "hsl(180, 70%, 50%)" }} />Scalping
          </Badge>
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: "hsl(45, 90%, 50%)" }} />Swing
          </Badge>
        </div>
      </Card>
    </div>
  );
};
