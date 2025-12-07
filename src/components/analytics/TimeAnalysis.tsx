import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useState, useMemo } from "react";
import { format, parseISO, startOfWeek } from "date-fns";

interface Props {
  rawTrades: any[];
  hourlyHeatmap: any[];
}

export const TimeAnalysis = ({ rawTrades, hourlyHeatmap }: Props) => {
  const [timeRange, setTimeRange] = useState("monthly");

  // Calculate P&L groupings on the fly
  const pnlData = useMemo(() => {
    const daily: Record<string, number> = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0 };
    const weekly: Record<string, number> = {};
    const monthly: Record<string, number> = {};

    rawTrades.forEach(t => {
      const date = parseISO(t.entry_time);
      const pnl = t.pnl || 0;

      // Daily (Day of Week)
      const dayName = format(date, 'eee'); // Mon, Tue...
      if (daily[dayName] !== undefined) {
        daily[dayName] += pnl;
      }

      // Monthly
      const monthName = format(date, 'MMM');
      monthly[monthName] = (monthly[monthName] || 0) + pnl;

      // Weekly
      const weekStart = format(startOfWeek(date), 'MMM dd');
      weekly[weekStart] = (weekly[weekStart] || 0) + pnl;
    });

    // Convert to arrays for Recharts
    const dailyArr = ["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => ({ name: day, value: daily[day] }));
    const monthlyArr = Object.entries(monthly).map(([name, value]) => ({ name, value }));
    const weeklyArr = Object.entries(weekly).map(([name, value]) => ({ name, value }));

    return { daily: dailyArr, weekly: weeklyArr, monthly: monthlyArr };
  }, [rawTrades]);

  const currentData = pnlData[timeRange as keyof typeof pnlData] || pnlData.monthly;
  
  // Calculate summary stats for the selected period
  const totalPeriodPnL = currentData.reduce((acc, curr) => acc + curr.value, 0);
  const sortedData = [...currentData].sort((a, b) => b.value - a.value);
  const bestPeriod = sortedData[0] || { value: 0 };
  const worstPeriod = sortedData[sortedData.length - 1] || { value: 0 };
  const avgPeriod = currentData.length > 0 ? totalPeriodPnL / currentData.length : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header & Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold">Time Analysis</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Day of Week</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">TOTAL P&L</p>
          <p className={`text-xl sm:text-3xl font-bold ${totalPeriodPnL >= 0 ? "text-success" : "text-destructive"}`}>
            ${totalPeriodPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">BEST</p>
          <p className="text-xl sm:text-3xl font-bold text-success">
            ${bestPeriod.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">WORST</p>
          <p className="text-xl sm:text-3xl font-bold text-destructive">
            ${worstPeriod.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">AVERAGE</p>
          <p className={`text-xl sm:text-3xl font-bold ${avgPeriod >= 0 ? "text-success" : "text-destructive"}`}>
            ${avgPeriod.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </Card>
      </div>

      {/* P&L Bar Chart */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">P&L BY {timeRange.toUpperCase()}</h3>
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[240px]">
          <BarChart data={currentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {currentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.value >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Time of Day Heatmap */}
      <Card className="p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">TIME OF DAY HEATMAP</h3>
          <span className="text-[10px] sm:text-xs text-muted-foreground">P&L by hour and day</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2 text-left">Hour</th>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2">Mon</th>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2">Tue</th>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2">Wed</th>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2">Thu</th>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2">Fri</th>
              </tr>
            </thead>
            <tbody>
              {hourlyHeatmap.map((row) => (
                <tr key={row.hour}>
                  <td className="text-[10px] sm:text-xs p-2 font-medium">{row.hour}</td>
                  {["mon", "tue", "wed", "thu", "fri"].map((day) => {
                    const value = row[day as keyof typeof row] as number;
                    // Calculate intensity: Cap at $500 for max color saturation
                    const intensity = Math.min(Math.abs(value) / 500, 1);
                    return (
                      <td key={day} className="p-1">
                        <div
                          className={`h-8 sm:h-10 rounded flex items-center justify-center text-[10px] sm:text-xs font-medium ${
                            value > 0 ? "text-success-foreground" : value < 0 ? "text-destructive-foreground" : "text-muted-foreground"
                          }`}
                          style={{
                            backgroundColor: value > 0 
                              ? `hsla(142, 76%, 36%, ${intensity})` 
                              : value < 0 
                                ? `hsla(0, 84%, 60%, ${intensity})` 
                                : "transparent",
                            opacity: value === 0 ? 0.5 : 1
                          }}
                        >
                          {value !== 0 ? (value > 0 ? `+${value.toFixed(0)}` : value.toFixed(0)) : "-"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};