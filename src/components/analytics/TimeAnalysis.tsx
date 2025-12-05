import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { useState } from "react";

const equityData = [
  { date: "Jan", value: 10000 },
  { date: "Feb", value: 9850 },
  { date: "Mar", value: 9720 },
  { date: "Apr", value: 10100 },
  { date: "May", value: 10450 },
  { date: "Jun", value: 10200 },
  { date: "Jul", value: 10800 },
  { date: "Aug", value: 11200 },
  { date: "Sep", value: 10900 },
  { date: "Oct", value: 11500 },
  { date: "Nov", value: 12100 },
  { date: "Dec", value: 12500 },
];

const dailyPnL = [
  { day: "Mon", value: 250 },
  { day: "Tue", value: -180 },
  { day: "Wed", value: 420 },
  { day: "Thu", value: -90 },
  { day: "Fri", value: 310 },
];

const weeklyPnL = [
  { week: "W1", value: 850 },
  { week: "W2", value: -320 },
  { week: "W3", value: 1200 },
  { week: "W4", value: 450 },
];

const monthlyPnL = [
  { month: "Jan", value: -150 },
  { month: "Feb", value: -130 },
  { month: "Mar", value: 380 },
  { month: "Apr", value: 350 },
  { month: "May", value: -250 },
  { month: "Jun", value: 600 },
  { month: "Jul", value: 400 },
  { month: "Aug", value: -300 },
  { month: "Sep", value: 600 },
  { month: "Oct", value: 400 },
  { month: "Nov", value: 400 },
  { month: "Dec", value: 200 },
];

const hourlyHeatmap = [
  { hour: "9:00", mon: 150, tue: -80, wed: 200, thu: 50, fri: -30 },
  { hour: "10:00", mon: 300, tue: 120, wed: -150, thu: 180, fri: 250 },
  { hour: "11:00", mon: -100, tue: 200, wed: 350, thu: -90, fri: 180 },
  { hour: "12:00", mon: 80, tue: -50, wed: 100, thu: 220, fri: -120 },
  { hour: "13:00", mon: 200, tue: 150, wed: -80, thu: 100, fri: 300 },
  { hour: "14:00", mon: -150, tue: 280, wed: 180, thu: -60, fri: 150 },
  { hour: "15:00", mon: 120, tue: -100, wed: 250, thu: 180, fri: -80 },
];

export const TimeAnalysis = () => {
  const [timeRange, setTimeRange] = useState("monthly");

  const getPnLData = () => {
    switch (timeRange) {
      case "daily": return { data: dailyPnL, key: "day" };
      case "weekly": return { data: weeklyPnL, key: "week" };
      case "monthly": return { data: monthlyPnL, key: "month" };
      default: return { data: monthlyPnL, key: "month" };
    }
  };

  const { data: pnlData, key: pnlKey } = getPnLData();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold">Time Analysis</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">TOTAL P&L</p>
          <p className="text-xl sm:text-3xl font-bold text-success">$2,500</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">BEST DAY</p>
          <p className="text-xl sm:text-3xl font-bold text-success">$1,200</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">WORST DAY</p>
          <p className="text-xl sm:text-3xl font-bold text-destructive">-$450</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">AVG DAILY</p>
          <p className="text-xl sm:text-3xl font-bold">$142</p>
        </Card>
      </div>

      {/* Equity Curve */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">EQUITY CURVE</h3>
          <span className="text-sm sm:text-lg font-bold text-success">+25%</span>
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[280px]">
          <AreaChart data={equityData}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
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
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--success))"
              fill="url(#equityGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* P&L by Time Period */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">P&L BY {timeRange.toUpperCase()}</h3>
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[240px]">
          <BarChart data={pnlData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={pnlKey} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {pnlData.map((entry, index) => (
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
      <Card className="p-4 sm:p-6">
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
                    const intensity = Math.min(Math.abs(value) / 300, 1);
                    return (
                      <td key={day} className="p-1">
                        <div
                          className={`h-8 sm:h-10 rounded flex items-center justify-center text-[10px] sm:text-xs font-medium ${
                            value >= 0 ? "text-success" : "text-destructive"
                          }`}
                          style={{
                            backgroundColor: value >= 0 
                              ? `hsla(142, 76%, 36%, ${intensity * 0.4})` 
                              : `hsla(0, 84%, 60%, ${intensity * 0.4})`
                          }}
                        >
                          {value >= 0 ? "+" : ""}{value}
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
