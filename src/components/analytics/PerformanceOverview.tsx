import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Target, Award, AlertTriangle } from "lucide-react";

const equityData = [
  { date: "Jan", value: 10000 },
  { date: "Feb", value: 9850 },
  { date: "Mar", value: 10200 },
  { date: "Apr", value: 10800 },
  { date: "May", value: 11200 },
  { date: "Jun", value: 10900 },
  { date: "Jul", value: 11500 },
  { date: "Aug", value: 12100 },
  { date: "Sep", value: 11800 },
  { date: "Oct", value: 12500 },
  { date: "Nov", value: 13200 },
  { date: "Dec", value: 13800 },
];

const performanceHighlights = [
  { label: "Best Month", value: "$2,100", subtext: "November 2024", positive: true },
  { label: "Worst Month", value: "-$450", subtext: "February 2024", positive: false },
  { label: "Longest Win Streak", value: "8 trades", subtext: "October 2024", positive: true },
  { label: "Longest Lose Streak", value: "4 trades", subtext: "March 2024", positive: false },
];

const keyMetrics = [
  { label: "Sharpe Ratio", value: "1.85", icon: TrendingUp, good: true },
  { label: "Sortino Ratio", value: "2.12", icon: Target, good: true },
  { label: "Max Drawdown", value: "-12.5%", icon: AlertTriangle, good: false },
  { label: "Recovery Factor", value: "3.2", icon: Award, good: true },
];

export const PerformanceOverview = () => {
  const totalReturn = ((13800 - 10000) / 10000 * 100).toFixed(1);
  const isPositive = parseFloat(totalReturn) > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">TOTAL P&L</p>
          <p className="text-xl sm:text-3xl font-bold text-success">$3,800</p>
          <div className="flex items-center gap-1 mt-1 sm:mt-2">
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
            <span className="text-xs sm:text-sm text-success">+38%</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">WIN RATE</p>
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-xl sm:text-3xl font-bold">62%</p>
            <div className="flex-1 hidden sm:block">
              <div className="relative h-16 sm:h-20 w-16 sm:w-20">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="hsl(var(--success))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 32 * 0.62} ${2 * Math.PI * 32}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">PROFIT FACTOR</p>
          <p className="text-xl sm:text-3xl font-bold">1.92</p>
          <div className="mt-2 sm:mt-3 space-y-1">
            <div className="h-1 sm:h-1.5 bg-success rounded-full" style={{ width: "65%" }} />
            <div className="h-1 sm:h-1.5 bg-destructive rounded-full" style={{ width: "35%" }} />
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">AVG WIN / LOSS</p>
          <div className="space-y-1.5 sm:space-y-2 mt-1.5 sm:mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 sm:h-8 bg-success rounded" style={{ width: "70%" }} />
              <span className="text-xs sm:text-sm font-medium">$520</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 sm:h-8 bg-destructive rounded" style={{ width: "50%" }} />
              <span className="text-xs sm:text-sm font-medium">$380</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Simplified Equity Curve */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">EQUITY CURVE</h3>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-success" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            )}
            <span className={`text-sm sm:text-lg font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? "+" : ""}{totalReturn}%
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220} className="sm:h-[300px]">
          <AreaChart data={equityData}>
            <defs>
              <linearGradient id="overviewEquityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Equity"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="url(#overviewEquityGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Key Metrics */}
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

        {/* Performance Highlights */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">PERFORMANCE HIGHLIGHTS</h3>
          </div>
          <div className="space-y-3">
            {performanceHighlights.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-xs sm:text-sm font-medium">{item.label}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{item.subtext}</p>
                </div>
                <span className={`text-sm sm:text-lg font-bold ${item.positive ? "text-success" : "text-destructive"}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">TRADING SUMMARY</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: "Total Trades", value: "142" },
            { label: "Winning Trades", value: "88", color: "text-success" },
            { label: "Losing Trades", value: "54", color: "text-destructive" },
            { label: "Avg Trade", value: "$26.76" },
            { label: "Largest Win", value: "$1,250", color: "text-success" },
            { label: "Largest Loss", value: "-$680", color: "text-destructive" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-muted/20 rounded-lg">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-sm sm:text-lg font-bold ${stat.color || ""}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
