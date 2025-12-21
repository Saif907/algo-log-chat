// frontend/src/components/analytics/PerformanceOverview.tsx
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Target, Award, AlertTriangle } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext"; // ✅ Import Context

interface Props {
  equityData: any[];
  stats: any;
}

export const PerformanceOverview = ({ equityData, stats }: Props) => {
  const { format, convert, currency } = useCurrency(); // ✅ Use Hook
  const isPositive = stats.netPL >= 0;

  // ✅ Convert Chart Data
  const convertedEquity = equityData.map(d => ({
    ...d,
    value: convert(d.value)
  }));

  const keyMetrics = [
    { label: "Win Rate", value: `${stats.winRate}%`, icon: TrendingUp, good: stats.winRate > 50 },
    { label: "Profit Factor", value: `${stats.profitFactor}`, icon: Target, good: Number(stats.profitFactor) > 1.5 },
    { label: "Max Drawdown", value: format(Math.abs(stats.maxDrawdown)), icon: AlertTriangle, good: false },
    { label: "Recovery Factor", value: stats.recoveryFactor, icon: Award, good: Number(stats.recoveryFactor) > 2 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
            TOTAL P&L ({currency})
          </p>
          <p className={`text-xl sm:text-3xl font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
            {/* ✅ Use format() */}
            {format(stats.netPL)}
          </p>
          <div className="flex items-center gap-1 mt-1 sm:mt-2">
            {isPositive ? <ArrowUpRight className="h-3 w-3 text-success" /> : <ArrowDownRight className="h-3 w-3 text-destructive" />}
            <span className="text-xs sm:text-sm text-muted-foreground">All Time</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">WIN RATE</p>
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-xl sm:text-3xl font-bold">{stats.winRate}%</p>
            <div className="flex-1 hidden sm:block">
              <div className="relative h-16 sm:h-20 w-16 sm:w-20">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                  <circle cx="40" cy="40" r="32" stroke="hsl(var(--success))" strokeWidth="8" fill="none"
                    strokeDasharray={`${2 * Math.PI * 32 * (stats.winRate / 100)} ${2 * Math.PI * 32}`} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">PROFIT FACTOR</p>
          <p className="text-xl sm:text-3xl font-bold">{stats.profitFactor}</p>
           <div className="mt-2 sm:mt-3 space-y-1">
            <div className="h-1 sm:h-1.5 bg-success rounded-full" style={{ width: "100%" }} />
            <div className="h-1 sm:h-1.5 bg-destructive rounded-full" style={{ width: `${Math.min((1/Number(stats.profitFactor || 1))*100, 100)}%` }} />
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">AVG WIN</p>
          <p className="text-xl sm:text-3xl font-bold text-success">
             {/* ✅ Use format() */}
            {format(stats.avgWin)}
          </p>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">EQUITY CURVE</h3>
        </div>
        <ResponsiveContainer width="100%" height={220} className="sm:h-[300px]">
          <AreaChart data={convertedEquity}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--popover-foreground))"
              }} 
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              // ✅ Formatter for tooltip
              formatter={(val: number) => format(val)}
            />
            
            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#equityGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">KEY METRICS</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {keyMetrics.map((metric) => (
              <div key={metric.label} className="p-3 sm:p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`h-4 w-4 ${metric.good ? "text-success" : "text-destructive"}`} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <p className={`text-lg sm:text-2xl font-bold ${metric.good ? "text-success" : "text-destructive"}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">TRADING SUMMARY</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Total Trades", value: stats.tradeCount },
              { label: "Win Rate", value: `${stats.winRate}%`, color: stats.winRate > 50 ? "text-success" : "text-destructive" },
              { label: "Avg Trade", value: format((stats.avgWin + stats.avgLoss)/2) },
              { label: "Largest Win", value: format(stats.largestWin), color: "text-success" },
              { label: "Largest Loss", value: format(stats.largestLoss), color: "text-destructive" },
              { label: "Avg Loss", value: format(Math.abs(stats.avgLoss)), color: "text-destructive" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 bg-muted/20 rounded-lg">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-sm sm:text-lg font-bold ${stat.color || ""}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};