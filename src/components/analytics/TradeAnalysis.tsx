import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, PieChart, Pie } from "recharts";

const rMultipleData = [
  { range: "-3R to -2R", count: 2, color: "destructive" },
  { range: "-2R to -1R", count: 5, color: "destructive" },
  { range: "-1R to 0R", count: 8, color: "destructive" },
  { range: "0R to 1R", count: 12, color: "success" },
  { range: "1R to 2R", count: 18, color: "success" },
  { range: "2R to 3R", count: 8, color: "success" },
  { range: "3R+", count: 4, color: "success" },
];

const scatterData = [
  { x: 50, y: 150, size: 100 },
  { x: 80, y: -120, size: 80 },
  { x: 120, y: 280, size: 150 },
  { x: 200, y: -180, size: 120 },
  { x: 250, y: 450, size: 200 },
  { x: 300, y: 180, size: 90 },
  { x: 350, y: -250, size: 130 },
  { x: 400, y: 320, size: 160 },
  { x: 450, y: -90, size: 70 },
  { x: 500, y: 580, size: 180 },
];

const mistakeData = [
  { name: "FOMO Entry", count: 12, pnl: -1850 },
  { name: "Early Exit", count: 8, pnl: -920 },
  { name: "No Stop Loss", count: 5, pnl: -2100 },
  { name: "Overtrading", count: 15, pnl: -1200 },
  { name: "Revenge Trading", count: 6, pnl: -1650 },
];

const tagData = [
  { name: "Breakout", value: 35 },
  { name: "Reversal", value: 25 },
  { name: "Scalp", value: 20 },
  { name: "Swing", value: 15 },
  { name: "Other", value: 5 },
];

const emotionData = [
  { emotion: "Confident", trades: 25, winRate: 72, pnl: 3200 },
  { emotion: "Anxious", trades: 12, winRate: 42, pnl: -580 },
  { emotion: "Neutral", trades: 35, winRate: 58, pnl: 1450 },
  { emotion: "Fearful", trades: 8, winRate: 38, pnl: -920 },
  { emotion: "Euphoric", trades: 6, winRate: 33, pnl: -650 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--destructive))", "hsl(180, 70%, 50%)", "hsl(var(--muted-foreground))"];

export const TradeAnalysis = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">TOTAL TRADES</p>
          <p className="text-xl sm:text-3xl font-bold">57</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">AVG R-MULTIPLE</p>
          <p className="text-xl sm:text-3xl font-bold text-success">1.8R</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">EXPECTANCY</p>
          <p className="text-xl sm:text-3xl font-bold">$142</p>
        </Card>
        <Card className="p-4 sm:p-6">
          <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">PROFIT FACTOR</p>
          <p className="text-xl sm:text-3xl font-bold">1.85</p>
        </Card>
      </div>

      {/* R-Multiple Distribution */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">R-MULTIPLE DISTRIBUTION</h3>
        </div>
        <ResponsiveContainer width="100%" height={200} className="sm:h-[240px]">
          <BarChart data={rMultipleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 9 }} />
            <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {rMultipleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color === "success" ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Trade Scatter Plot */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">TRADE SIZE VS P&L</h3>
          </div>
          <ResponsiveContainer width="100%" height={200} className="sm:h-[240px]">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="x" name="Position Size" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <YAxis dataKey="y" name="P&L" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Scatter data={scatterData} fill="hsl(var(--primary))">
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.y >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        {/* Tag Distribution */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">TRADE TAGS</h3>
          </div>
          <ResponsiveContainer width="100%" height={200} className="sm:h-[240px]">
            <PieChart>
              <Pie
                data={tagData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {tagData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {tagData.map((tag, index) => (
              <Badge key={tag.name} variant="secondary" className="text-[10px] sm:text-xs">
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index] }} />
                {tag.name}: {tag.value}%
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Mistake Patterns */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">MISTAKE PATTERNS</h3>
          <span className="text-[10px] sm:text-xs text-muted-foreground">Impact on P&L</span>
        </div>
        <div className="space-y-3">
          {mistakeData.map((mistake) => (
            <div key={mistake.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-medium">{mistake.name}</span>
                <Badge variant="secondary" className="text-[10px]">{mistake.count} trades</Badge>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-destructive">
                ${Math.abs(mistake.pnl).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Emotion Analysis */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">EMOTION ANALYSIS</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2 text-left font-medium">Emotion</th>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2 text-center font-medium">Trades</th>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2 text-center font-medium">Win Rate</th>
                <th className="text-[10px] sm:text-xs text-muted-foreground p-2 text-right font-medium">P&L</th>
              </tr>
            </thead>
            <tbody>
              {emotionData.map((row) => (
                <tr key={row.emotion} className="border-b border-border last:border-0">
                  <td className="text-xs sm:text-sm p-2 font-medium">{row.emotion}</td>
                  <td className="text-xs sm:text-sm p-2 text-center">{row.trades}</td>
                  <td className="text-xs sm:text-sm p-2 text-center">
                    <span className={row.winRate >= 50 ? "text-success" : "text-destructive"}>
                      {row.winRate}%
                    </span>
                  </td>
                  <td className={`text-xs sm:text-sm p-2 text-right font-semibold ${row.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                    {row.pnl >= 0 ? "+" : ""}${row.pnl.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
