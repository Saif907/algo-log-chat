import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, getHours, startOfMonth, endOfMonth, getDay } from "date-fns";

export const useAnalytics = () => {
  const { data: trades, isLoading } = useQuery({
    queryKey: ['analytics_trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select(`
          *,
          strategies (name)
        `)
        .order('entry_time', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const processData = () => {
    if (!trades || trades.length === 0) return null;

    // --- 1. Equity Curve & Global Stats ---
    let runningPnL = 0;
    let peakEquity = 0;
    let maxDrawdown = 0;
    let winCount = 0;
    let lossCount = 0;
    let totalWinPnL = 0;
    let totalLossPnL = 0;

    const equityData = trades.map(t => {
      const pnl = t.pnl || 0;
      runningPnL += pnl;
      
      if (runningPnL > peakEquity) peakEquity = runningPnL;
      const dd = runningPnL - peakEquity;
      if (dd < maxDrawdown) maxDrawdown = dd;

      if (pnl > 0) {
        winCount++;
        totalWinPnL += pnl;
      } else if (pnl < 0) {
        lossCount++;
        totalLossPnL += pnl;
      }

      return {
        date: format(parseISO(t.entry_time), 'MMM dd'),
        value: runningPnL
      };
    });

    const totalTrades = trades.length;
    const winRate = totalTrades > 0 ? Math.round((winCount / totalTrades) * 100) : 0;
    const avgWin = winCount > 0 ? totalWinPnL / winCount : 0;
    const avgLoss = lossCount > 0 ? totalLossPnL / lossCount : 0;
    const profitFactor = Math.abs(totalLossPnL) > 0 
      ? (totalWinPnL / Math.abs(totalLossPnL)).toFixed(2) 
      : totalWinPnL > 0 ? "∞" : "0";
    const recoveryFactor = Math.abs(maxDrawdown) > 0 ? (runningPnL / Math.abs(maxDrawdown)).toFixed(1) : "∞";

    // --- 2. Advanced Metrics (Mistakes, Emotions, Tags) ---
    const mistakeMap: Record<string, { count: number; pnl: number }> = {};
    const emotionMap: Record<string, { trades: number; wins: number; pnl: number }> = {};
    const tagMap: Record<string, number> = {};
    
    trades.forEach(t => {
      // Mistakes
      if (t.mistakes && t.mistakes.length > 0) {
        t.mistakes.forEach((m: string) => {
          if (!mistakeMap[m]) mistakeMap[m] = { count: 0, pnl: 0 };
          mistakeMap[m].count++;
          mistakeMap[m].pnl += (t.pnl || 0);
        });
      }

      // Emotions
      const emo = t.emotion || "Neutral";
      if (!emotionMap[emo]) emotionMap[emo] = { trades: 0, wins: 0, pnl: 0 };
      emotionMap[emo].trades++;
      emotionMap[emo].pnl += (t.pnl || 0);
      if ((t.pnl || 0) > 0) emotionMap[emo].wins++;

      // Tags
      if (t.tags && t.tags.length > 0) {
        t.tags.forEach((tag: string) => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
      } else {
        tagMap["Untagged"] = (tagMap["Untagged"] || 0) + 1;
      }
    });

    const mistakeData = Object.entries(mistakeMap)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => a.pnl - b.pnl); // Worst PnL first

    const emotionData = Object.entries(emotionMap)
      .map(([emotion, stats]) => ({
        emotion,
        trades: stats.trades,
        winRate: Math.round((stats.wins / stats.trades) * 100),
        pnl: stats.pnl
      }));

    const tagData = Object.entries(tagMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // --- 3. Strategy Deep Dive (Monthly Breakdown) ---
    const stratMap: Record<string, any> = {};
    const monthlyStratMap: Record<string, Record<string, number>> = {}; // month -> { StratA: 100, StratB: -50 }

    trades.forEach(t => {
      const name = t.strategies?.name || "No Strategy";
      const pnl = t.pnl || 0;
      const month = format(parseISO(t.entry_time), 'MMM');

      // Global Strategy Stats
      if (!stratMap[name]) {
        stratMap[name] = { name, trades: 0, wins: 0, pnl: 0, maxDrawdown: 0, running: 0, peak: 0 };
      }
      const s = stratMap[name];
      s.trades++;
      s.pnl += pnl;
      s.running += pnl;
      if (pnl > 0) s.wins++;
      if (s.running > s.peak) s.peak = s.running;
      if ((s.running - s.peak) < s.maxDrawdown) s.maxDrawdown = s.running - s.peak;

      // Monthly Breakdown
      if (!monthlyStratMap[month]) monthlyStratMap[month] = {};
      if (!monthlyStratMap[month][name]) monthlyStratMap[month][name] = 0;
      monthlyStratMap[month][name] += pnl;
    });

    const strategyLeaderboard = Object.values(stratMap).map((s: any) => ({
      ...s,
      winRate: Math.round((s.wins / s.trades) * 100),
      avgR: 0, // Placeholder
      profitFactor: 0 // Placeholder
    })).sort((a, b) => b.pnl - a.pnl);

    const monthlyStrategyPerf = Object.entries(monthlyStratMap).map(([month, strats]) => ({
      month,
      ...strats
    }));

    // --- 4. Hourly Heatmap ---
    const hoursMap: Record<number, Record<string, number>> = {}; 
    trades.forEach(t => {
      const date = parseISO(t.entry_time);
      const day = format(date, 'eee').toLowerCase();
      const hour = getHours(date);
      if (!hoursMap[hour]) hoursMap[hour] = { mon:0, tue:0, wed:0, thu:0, fri:0, sat:0, sun:0 };
      // @ts-ignore
      hoursMap[hour][day] += (t.pnl || 0);
    });
    const hourlyHeatmap = Object.entries(hoursMap).map(([hour, days]) => ({
      hour: `${hour}:00`,
      ...days
    })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    // --- 5. R-Multiple Distribution ---
    const rBins = { "-3R+": 0, "-2R": 0, "-1R": 0, "0R": 0, "1R": 0, "2R": 0, "3R+": 0 };
    trades.forEach(t => {
        // Approximation if Risk not logged: 1% of entry
        const risk = t.stop_loss ? Math.abs(t.entry_price - t.stop_loss) * t.quantity : (t.entry_price * t.quantity * 0.01);
        const r = risk > 0 ? (t.pnl || 0) / risk : 0;
        
        if (r <= -3) rBins["-3R+"]++;
        else if (r <= -2) rBins["-2R"]++;
        else if (r < 0) rBins["-1R"]++;
        else if (r < 1) rBins["0R"]++;
        else if (r < 2) rBins["1R"]++;
        else if (r < 3) rBins["2R"]++;
        else rBins["3R+"]++;
    });
    
    const rMultipleData = Object.entries(rBins).map(([range, count]) => ({ 
        range, 
        count, 
        color: range.includes("-") ? "destructive" : "success" 
    }));

    return {
      rawTrades: trades,
      equityData,
      hourlyHeatmap,
      strategyLeaderboard,
      monthlyStrategyPerf,
      mistakeData,
      emotionData,
      tagData,
      rMultipleData,
      globalStats: {
        netPL: runningPnL,
        winRate,
        profitFactor,
        avgWin,
        avgLoss,
        maxDrawdown,
        recoveryFactor,
        tradeCount: totalTrades,
        largestWin: Math.max(...trades.map(t => t.pnl || 0)),
        largestLoss: Math.min(...trades.map(t => t.pnl || 0))
      }
    };
  };

  return {
    data: processData(),
    isLoading
  };
};