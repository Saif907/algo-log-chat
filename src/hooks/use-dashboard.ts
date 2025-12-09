// frontend/src/hooks/use-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard_trades'],
    queryFn: async () => {
      // Fetch all trades to calculate accurate cumulative stats
      const { data, error } = await supabase
        .from('trades')
        .select(`
          id,
          symbol,
          direction,
          entry_time,
          pnl,
          status,
          instrument_type,
          quantity,
          strategies (name)
        `)
        .order('entry_time', { ascending: true }); // Oldest first for cumulative calc

      if (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
      }
      
      return calculateStats(data || []);
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
    const instrumentMap = new Map<string, { pnl: number, count: number, direction: string, type: string }>();

    // ✅ FILTER: Ignore Canceled/Pending trades for stats
    const activeTrades = tradeList.filter(t => 
      t.status === "CLOSED" || (t.status === "OPEN" && t.pnl !== null)
    );

    activeTrades.forEach((trade) => {
      // ✅ SAFETY: Force number type for float/decimal math
      const pnl = Number(trade.pnl || 0);
      netPL += pnl;

      // Win/Loss Counts
      if (pnl > 0) {
        winCount++;
        grossProfit += pnl;
      } else if (pnl < 0) {
        lossCount++;
        grossLoss += Math.abs(pnl); 
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
      if (!instrumentMap.has(sym)) {
        instrumentMap.set(sym, { 
          pnl: 0, 
          count: 0, 
          direction: trade.direction,
          type: trade.instrument_type || "STOCK"
        });
      }
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
    const totalTrades = winCount + lossCount; 
    const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
    
    // Profit Factor (Gross Profit / Gross Loss)
    // If Gross Loss is 0, we cap the PF at a sensible high number (e.g. 100) to avoid Infinity
    const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : (grossProfit > 0 ? "100.00" : "0.00");
    
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
            direction: stats.direction,
            type: stats.type,
            pnl: stats.pnl
        }))
        .sort((a, b) => Math.abs(b.pnl) - Math.abs(a.pnl))
        .slice(0, 5);

    // 5. Recent Activity (Show ALL trades, even Open ones, sorted new -> old)
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
    stats,
    isLoading,
    error
  };
};