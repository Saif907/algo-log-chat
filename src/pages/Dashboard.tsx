import { Card } from "@/components/ui/card";
import { ChatInput } from "@/components/ChatInput";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { startOfMonth, endOfMonth, getDay, getDate, isSameMonth, format } from "date-fns";

export const Dashboard = () => {
  const { stats, isLoading } = useDashboard();
  const navigate = useNavigate();

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
             {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
             <Skeleton className="h-[300px] rounded-xl" />
             <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  // Helper for currency formatting
  const fmtCurrency = (val: number) => `$${val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Mini Calendar Generation
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const startDay = getDay(monthStart); // 0 = Sunday
  const daysInMonth = getDate(monthEnd);
  
  // Create calendar grid array
  // Padding for empty days at start
  const calendarDays = Array(startDay).fill(null);
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Map daily performance to calendar
  const getDayStatus = (day: number) => {
    if (!day) return null;
    // Format date to match the dailyData format "MMM dd" e.g., "Nov 15"
    const dateStr = format(new Date(today.getFullYear(), today.getMonth(), day), 'MMM dd');
    const dayStat = stats.dailyData.find(d => d.date === dateStr);
    
    if (!dayStat) return "none";
    if (dayStat.value > 0) return "win";
    if (dayStat.value < 0) return "loss";
    return "neutral";
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-4 sm:space-y-6 pb-28 sm:pb-32">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">NET P/L</p>
          <p className={`text-xl sm:text-3xl font-bold ${stats.netPL >= 0 ? 'text-success' : 'text-destructive'}`}>
            {stats.netPL >= 0 ? "+" : ""}{fmtCurrency(stats.netPL)}
          </p>
          <div className="flex items-center gap-1 mt-1 sm:mt-2">
            {stats.netPL >= 0 ? (
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
            ) : (
                <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
            )}
            <span className="text-xs sm:text-sm text-muted-foreground">All time</span>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">WIN RATE</p>
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-xl sm:text-3xl font-bold">{stats.winRate.toFixed(1)}%</p>
            <div className="flex-1 hidden sm:block">
              <div className="relative h-16 sm:h-24 w-16 sm:w-24">
                <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="40" stroke="hsl(var(--success))" strokeWidth="8" fill="none"
                    strokeDasharray={`${2 * Math.PI * 40 * (stats.winRate / 100)} ${2 * Math.PI * 40}`} strokeLinecap="round" />
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
            <div className="h-1 sm:h-1.5 bg-destructive rounded-full" style={{ width: `${Math.min((1/Number(stats.profitFactor))*100, 100)}%` }} />
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">AVG WIN / LOSS</p>
          <div className="space-y-1.5 sm:space-y-2 mt-1.5 sm:mt-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 sm:h-8 bg-success rounded flex items-center px-2 text-success-foreground text-xs font-bold">
                 {fmtCurrency(stats.avgWin)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-6 sm:h-8 bg-destructive rounded flex items-center px-2 text-destructive-foreground text-xs font-bold">
                 {fmtCurrency(stats.avgLoss)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">NET CUMULATIVE P&L</h3>
            <span className={`text-sm sm:text-lg font-bold ${stats.netPL >= 0 ? 'text-success' : 'text-destructive'}`}>
                {stats.netPL >= 0 ? "+" : ""}{fmtCurrency(stats.netPL)}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={160} className="sm:h-[200px]">
            <AreaChart data={stats.cumulativeData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorValue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">NET DAILY P&L</h3>
          </div>
          <ResponsiveContainer width="100%" height={160} className="sm:h-[200px]">
            <BarChart data={stats.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <Tooltip 
                 cursor={{fill: 'hsl(var(--muted)/0.2)'}}
                 contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stats.dailyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"} />
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
            <button onClick={() => navigate('/strategies')} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">View All</button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {stats.strategyPerformance.length > 0 ? stats.strategyPerformance.map((strategy) => (
              <div key={strategy.name} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium">{strategy.name}</span>
                  <span className="text-xs sm:text-sm font-semibold">{strategy.value}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${strategy.value}%` }} />
                </div>
              </div>
            )) : (
                <p className="text-sm text-muted-foreground">No strategy data available.</p>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">TOP INSTRUMENTS</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {stats.topInstruments.length > 0 ? stats.topInstruments.map((instrument) => (
              <div key={instrument.symbol} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-bold">{instrument.symbol}</span>
                  <Badge variant="outline" className={
                      instrument.direction === "LONG" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" : "bg-pink-500/10 text-pink-500 border-pink-500/20"
                  }>
                    {instrument.direction}
                  </Badge>
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${
                  instrument.pnl >= 0 ? "text-success" : "text-destructive"
                }`}>
                  {instrument.pnl >= 0 ? "+" : ""}{fmtCurrency(instrument.pnl)}
                </span>
              </div>
            )) : (
                <p className="text-sm text-muted-foreground">No trading data available.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Trades and Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">RECENT TRADES</h3>
            <button onClick={() => navigate('/trades')} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground">View All</button>
          </div>
          <div className="space-y-2">
            {stats.recentTrades.length > 0 ? stats.recentTrades.map((trade: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-2 hover:bg-muted/50 rounded px-2 cursor-pointer transition-colors" onClick={() => navigate(`/trades/${trade.id}`)}>
                <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-medium w-16">{trade.symbol}</span>
                    <Badge variant="outline" className={
                        trade.direction === "LONG" 
                        ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" 
                        : "bg-pink-500/10 text-pink-500 border-pink-500/20"
                    }>
                        {trade.direction}
                    </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                        {new Date(trade.entry_time).toLocaleDateString()}
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold w-20 text-right ${
                    (trade.pnl || 0) >= 0 ? "text-success" : "text-destructive"
                    }`}>
                    {(trade.pnl || 0) >= 0 ? "+" : ""}{fmtCurrency(trade.pnl || 0)}
                    </span>
                </div>
              </div>
            )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No trades logged yet.</p>
            )}
          </div>
        </Card>

        {/* Mini Calendar (Restored) */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">MINI CALENDAR</h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground">{format(today, 'MMMM yyyy')}</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-center text-[10px] sm:text-xs text-muted-foreground py-1">
                {day}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="aspect-square" />;
              
              const status = getDayStatus(day);
              let bgClass = "bg-muted/20"; // Default
              if (status === "win") bgClass = "bg-success/30 text-success-foreground font-bold border border-success/50";
              if (status === "loss") bgClass = "bg-destructive/30 text-destructive-foreground font-bold border border-destructive/50";
              if (status === "neutral") bgClass = "bg-muted/50 font-medium";

              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs rounded-md transition-all cursor-default ${bgClass}`}
                  title={status !== "none" ? `Trading Day` : ""}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <ChatInput placeholder="Ask anything about your trading performance..." />
    </div>
  );
};