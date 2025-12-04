import { Card } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const cumulativeData = [
  { date: "Jan", value: 0 },
  { date: "Feb", value: -150 },
  { date: "Mar", value: -280 },
  { date: "Apr", value: -180 },
  { date: "May", value: -120 },
  { date: "Jun", value: 100 },
];

const dailyData = [
  { date: "Mon", value: -180 },
  { date: "Tue", value: 220 },
  { date: "Wed", value: -90 },
  { date: "Thu", value: 150 },
  { date: "Fri", value: -200 },
  { date: "Sat", value: 180 },
];

const strategyPerformance = [
  { name: "Breakout", value: 65 },
  { name: "Mean Reversion", value: 48 },
];

const topInstruments = [
  { symbol: "ES", direction: "LONG", pnl: 850.00 },
  { symbol: "NQ", direction: "SHORT", pnl: 320.00 },
  { symbol: "YM", direction: "LONG", pnl: -180.00 },
  { symbol: "RTY", direction: "SHORT", pnl: -240.00 },
];

export const Dashboard = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-4 sm:space-y-6 pb-28 sm:pb-32">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">NET P/L</p>
          <p className="text-xl sm:text-3xl font-bold text-destructive">$ -250.00</p>
          <div className="flex items-center gap-1 mt-1 sm:mt-2">
            <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
            <span className="text-xs sm:text-sm text-destructive">12%</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">WIN RATE</p>
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-xl sm:text-3xl font-bold">50%</p>
            <div className="flex-1 hidden sm:block">
              <div className="relative h-16 sm:h-24 w-16 sm:w-24">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="hsl(var(--success))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.5} ${2 * Math.PI * 40}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">PROFIT FACTOR</p>
          <p className="text-xl sm:text-3xl font-bold">0.64</p>
          <div className="mt-2 sm:mt-3 space-y-1">
            <div className="h-1 sm:h-1.5 bg-success rounded-full" style={{ width: "60%" }} />
            <div className="h-1 sm:h-1.5 bg-destructive rounded-full" style={{ width: "100%" }} />
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">AVG WIN / LOSS</p>
          <div className="space-y-1.5 sm:space-y-2 mt-1.5 sm:mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 sm:h-8 bg-success rounded" style={{ width: "60%" }} />
              <span className="text-xs sm:text-sm font-medium">$450</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 sm:h-8 bg-destructive rounded" style={{ width: "100%" }} />
              <span className="text-xs sm:text-sm font-medium">$720</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">NET CUMULATIVE P&L</h3>
            <span className="text-sm sm:text-lg font-bold text-destructive">$ -250.00</span>
          </div>
          <ResponsiveContainer width="100%" height={160} className="sm:h-[200px]">
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--destructive))"
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">NET DAILY P&L</h3>
          </div>
          <ResponsiveContainer width="100%" height={160} className="sm:h-[200px]">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dailyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">STRATEGY PERFORMANCE</h3>
            <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">View All</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {strategyPerformance.map((strategy) => (
              <div key={strategy.name} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium">{strategy.name}</span>
                  <span className="text-xs sm:text-sm font-semibold">{strategy.value}%</span>
                </div>
                <div className="h-6 sm:h-8 bg-success rounded" style={{ width: `${strategy.value}%` }} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">TOP INSTRUMENTS</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {topInstruments.map((instrument) => (
              <div key={instrument.symbol} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-bold">{instrument.symbol}</span>
                  <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                    instrument.direction === "LONG" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  }`}>
                    {instrument.direction}
                  </span>
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${
                  instrument.pnl >= 0 ? "text-success" : "text-destructive"
                }`}>
                  ${Math.abs(instrument.pnl).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Trades and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">RECENT TRADES</h3>
            <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">View All</button>
          </div>
          <div className="space-y-2">
            {[
              { symbol: "ES", direction: "LONG", pnl: 250.00 },
              { symbol: "NQ", direction: "SHORT", pnl: -180.00 },
              { symbol: "ES", direction: "SHORT", pnl: 120.00 },
              { symbol: "YM", direction: "LONG", pnl: -90.00 },
            ].map((trade, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 sm:py-2">
                <span className="text-xs sm:text-sm font-medium">{trade.symbol}</span>
                <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${
                  trade.direction === "LONG" ? "bg-cyan-500/20 text-cyan-400" : "bg-pink-500/20 text-pink-400"
                }`}>
                  {trade.direction}
                </span>
                <span className={`text-xs sm:text-sm font-semibold ${
                  trade.pnl >= 0 ? "text-success" : "text-destructive"
                }`}>
                  ${Math.abs(trade.pnl).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">MINI CALENDAR</h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground">November 2025</span>
          </div>
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <div key={i} className="text-center text-[10px] sm:text-xs text-muted-foreground py-1">
                {day}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const hasTrade = [5, 8, 12, 15, 19, 22, 26].includes(day);
              const isPositive = [12, 15, 22].includes(day);
              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs rounded ${
                    hasTrade
                      ? isPositive
                        ? "bg-success/30 text-success font-semibold"
                        : "bg-destructive/30 text-destructive font-semibold"
                      : "bg-muted/10"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
