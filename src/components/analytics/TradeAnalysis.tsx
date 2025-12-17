import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, PieChart, Pie } from "recharts";
import { useMemo } from "react";

interface Props {
  rawTrades: any[];
  mistakeData: any[];
  emotionData: any[];
  tagData: any[];
  rMultipleData: any[];
}

export const TradeAnalysis = ({ rawTrades, mistakeData, emotionData, tagData, rMultipleData }: Props) => {
  
  const scatterData = useMemo(() => {
    return rawTrades.map(t => ({
      x: t.quantity * t.entry_price, 
      y: t.pnl || 0,
      size: 100 
    }));
  }, [rawTrades]);

  const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--destructive))", "hsl(180, 70%, 50%)", "hsl(var(--muted-foreground))"];

  const tooltipStyle = {
    backgroundColor: "hsl(var(--popover))",
    borderColor: "hsl(var(--border))",
    color: "hsl(var(--popover-foreground))"
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* R-Multiple Distribution */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold mb-4">R-MULTIPLE DISTRIBUTION</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={rMultipleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
            
            {/* ✅ FIXED: Tooltip Colors */}
            <Tooltip 
              cursor={{fill: 'transparent'}} 
              contentStyle={tooltipStyle}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {rMultipleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color === "success" ? "hsl(var(--success))" : "hsl(var(--destructive))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Scatter Plot */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-4">SIZE VS P&L</h3>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="x" name="Size" unit="$" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis dataKey="y" name="P&L" unit="$" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              
              {/* ✅ FIXED: Tooltip Colors */}
              <Tooltip 
                cursor={{strokeDasharray: '3 3'}} 
                contentStyle={tooltipStyle}
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              
              <Scatter data={scatterData} fill="hsl(var(--primary))">
                 {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.y >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        {/* Tag Pie Chart */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-4">TRADE TAGS</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={tagData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {tagData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* ✅ FIXED: Tooltip Colors */}
              <Tooltip 
                contentStyle={tooltipStyle}
                itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {tagData.map((tag, index) => (
              <Badge key={tag.name} variant="secondary" className="text-[10px]">
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {tag.name}: {tag.value}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Mistake Patterns */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold">MISTAKE PATTERNS</h3>
          <span className="text-[10px] text-muted-foreground">Impact on P&L</span>
        </div>
        <div className="space-y-3">
          {mistakeData.length > 0 ? mistakeData.map((mistake) => (
            <div key={mistake.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{mistake.name}</span>
                <Badge variant="secondary" className="text-[10px]">{mistake.count} trades</Badge>
              </div>
              <span className="text-sm font-semibold text-destructive">${Math.abs(mistake.pnl).toLocaleString()}</span>
            </div>
          )) : <p className="text-sm text-muted-foreground">No mistakes recorded.</p>}
        </div>
      </Card>

      {/* Emotion Analysis */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-xs sm:text-sm font-semibold mb-4">EMOTION ANALYSIS</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-xs text-muted-foreground p-2 text-left">Emotion</th>
                <th className="text-xs text-muted-foreground p-2 text-center">Trades</th>
                <th className="text-xs text-muted-foreground p-2 text-center">Win Rate</th>
                <th className="text-xs text-muted-foreground p-2 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {emotionData.length > 0 ? emotionData.map((row) => (
                <tr key={row.emotion} className="border-b border-border last:border-0">
                  <td className="text-sm p-2 font-medium">{row.emotion}</td>
                  <td className="text-sm p-2 text-center">{row.trades}</td>
                  <td className="text-sm p-2 text-center"><span className={row.winRate >= 50 ? "text-success" : "text-destructive"}>{row.winRate}%</span></td>
                  <td className={`text-sm p-2 text-right font-semibold ${row.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                    {row.pnl >= 0 ? "+" : ""}${row.pnl.toLocaleString()}
                  </td>
                </tr>
              )) : <tr><td colSpan={4} className="text-center p-4 text-muted-foreground">No emotions logged.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};