import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboard = () => {
  const { data: trades, isLoading, error } = useQuery({
    queryKey: ['dashboard_trades'],
    queryFn: async () => {
      // Fetch all trades to calculate accurate cumulative stats
      // For a production app with 10k+ trades, you'd want to calculate this in a Postgres View or Edge Function
      const { data, error } = await supabase
        .from('trades')
        .select(`
          id,
          symbol,
          direction,
          entry_time,
          pnl,
          status,
          strategies (name)
        `)
        .order('entry_time', { ascending: true }); // Oldest first for cumulative calc

      if (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
      }
      
      return data || [];
    }
  });

  // Calculate Metrics on the fly
  const calculateStats = (tradeList: any[]) => {
    if (!tradeList || tradeList.length === 0) return null;

    let netPL = 0;
    let winCount = 0;
    let lossCount = 0;
    let grossProfit = 0;
    let grossLoss = 0;

    // Maps for Aggregation
    const dailyMap = new Map<string, number>();
    const strategyMap = new Map<string, { wins: number, total: number }>();
    const instrumentMap = new Map<string, { pnl: number, count: number, direction: string }>();

    tradeList.forEach((trade) => {
      const pnl = trade.pnl || 0;
      netPL += pnl;

      // Win/Loss Counts
      if (pnl > 0) {
        winCount++;
        grossProfit += pnl;
      } else if (pnl < 0) {
        lossCount++;
        grossLoss += Math.abs(pnl); // Positive number for calc
      }

      // Daily P&L (Group by Date)
      const dateKey = new Date(trade.entry_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + pnl);

      // Strategy Performance
      const stratName = trade.strategies?.name || "No Strategy";
      if (!strategyMap.has(stratName)) strategyMap.set(stratName, { wins: 0, total: 0 });
      const stratStats = strategyMap.get(stratName)!;
      stratStats.total++;
      if (pnl > 0) stratStats.wins++;

      // Top Instruments
      const sym = trade.symbol;
      if (!instrumentMap.has(sym)) instrumentMap.set(sym, { pnl: 0, count: 0, direction: trade.direction });
      const instStats = instrumentMap.get(sym)!;
      instStats.pnl += pnl;
      instStats.count++;
    });

    // 1. Charts Data
    const dailyData = Array.from(dailyMap.entries()).map(([date, value]) => ({ date, value }));
    
    // Cumulative P&L Curve
    let runningTotal = 0;
    const cumulativeData = dailyData.map(day => {
        runningTotal += day.value;
        return { date: day.date, value: runningTotal };
    });

    // 2. KPIs
    const totalTrades = winCount + lossCount; // Exclude break-even/open if needed
    const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 999 : 0);
    const avgWin = winCount > 0 ? grossProfit / winCount : 0;
    const avgLoss = lossCount > 0 ? grossLoss / lossCount : 0;

    // 3. Strategy Ranking (by Win Rate)
    const strategyPerformance = Array.from(strategyMap.entries())
        .map(([name, stats]) => ({
            name,
            value: Math.round((stats.wins / stats.total) * 100)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // 4. Top Instruments (by Absolute P&L Impact)
    const topInstruments = Array.from(instrumentMap.entries())
        .map(([symbol, stats]) => ({
            symbol,
            direction: stats.direction, // Just shows the last direction, simpler for MVP
            pnl: stats.pnl
        }))
        .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
        .slice(0, 5);

    // 5. Recent Activity (Reverse chronological)
    const recentTrades = [...tradeList]
        .sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime())
        .slice(0, 5);

    return {
      netPL,
      winRate,
      profitFactor,
      avgWin,
      avgLoss,
      cumulativeData,
      dailyData,
      strategyPerformance,
      topInstruments,
      recentTrades
    };
  };

  return {
    stats: calculateStats(trades || []),
    isLoading,
    error
  };
};