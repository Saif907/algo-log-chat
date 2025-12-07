// src/hooks/use-calendar.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth } from "date-fns";

export interface DayStats {
  trades: number;
  pnl: number;
  wins: number;
  winRate: number;
  totalR: number;
  emotion: string;
  playbooks: { name: string; count: number }[];
  bestStrategy?: string;
  bestTrade: { symbol: string; pnl: number };
  worstTrade: { symbol: string; pnl: number };
  tradesList: Array<{
    id: string;
    symbol: string;
    direction: string;
    entry: number;
    exit: number;
    pnl: number;
  }>;
}

export const useCalendar = (currentDate: Date) => {
  const { data: dailyStats, isLoading, error } = useQuery({
    queryKey: ['calendar_trades', currentDate.getFullYear(), currentDate.getMonth()],
    queryFn: async () => {
      // 1. Define Month Range
      const start = startOfMonth(currentDate).toISOString();
      const end = endOfMonth(currentDate).toISOString();

      // 2. Fetch Trades for this month
      const { data: trades, error } = await supabase
        .from('trades')
        .select(`
          *,
          strategies (name)
        `)
        .gte('entry_time', start)
        .lte('entry_time', end);

      if (error) throw error;

      // 3. Aggregate by Day
      const statsByDay: Record<number, DayStats> = {};

      trades?.forEach(trade => {
        const day = new Date(trade.entry_time).getDate();
        
        // Initialize day if missing
        if (!statsByDay[day]) {
          statsByDay[day] = {
            trades: 0,
            pnl: 0,
            wins: 0,
            winRate: 0,
            totalR: 0,
            emotion: "Neutral",
            playbooks: [],
            bestTrade: { symbol: "-", pnl: -Infinity },
            worstTrade: { symbol: "-", pnl: Infinity },
            tradesList: []
          };
          // Temporary storage for aggregation
          (statsByDay[day] as any)._playbookMap = {};
          (statsByDay[day] as any)._emotions = {};
        }

        const dayStat = statsByDay[day];
        const tempStat = dayStat as any;

        // Basic Stats
        dayStat.trades += 1;
        dayStat.pnl += (trade.pnl || 0);
        if ((trade.pnl || 0) > 0) dayStat.wins += 1;

        // R-Multiple Calculation
        const risk = trade.stop_loss ? Math.abs(trade.entry_price - trade.stop_loss) * trade.quantity : 0;
        const r = (risk > 0 && trade.pnl) ? trade.pnl / risk : 0;
        dayStat.totalR += r;

        // Strategy Counting
        const stratName = trade.strategies?.name || "No Strategy";
        tempStat._playbookMap[stratName] = (tempStat._playbookMap[stratName] || 0) + 1;

        // Emotion Counting
        if (trade.emotion) {
          tempStat._emotions[trade.emotion] = (tempStat._emotions[trade.emotion] || 0) + 1;
        }

        // Best/Worst Trade
        if ((trade.pnl || 0) > dayStat.bestTrade.pnl) {
          dayStat.bestTrade = { symbol: trade.symbol, pnl: trade.pnl || 0 };
        }
        if ((trade.pnl || 0) < dayStat.worstTrade.pnl) {
          dayStat.worstTrade = { symbol: trade.symbol, pnl: trade.pnl || 0 };
        }

        // Add to List
        dayStat.tradesList.push({
            id: trade.id,
            symbol: trade.symbol,
            direction: trade.direction,
            entry: trade.entry_price,
            exit: trade.exit_price || 0,
            pnl: trade.pnl || 0
        });
      });

      // 4. Finalize derived stats (Win Rate, Dominant Emotion, Arrays)
      Object.keys(statsByDay).forEach(key => {
        const day = parseInt(key);
        const stat = statsByDay[day];
        const temp = stat as any;

        // Win Rate
        stat.winRate = Math.round((stat.wins / stat.trades) * 100);
        stat.totalR = parseFloat(stat.totalR.toFixed(1)); // Round R

        // Playbooks Array & Best Strategy
        let maxStratCount = 0;
        const playbookArray = [];
        for (const [name, count] of Object.entries(temp._playbookMap)) {
            playbookArray.push({ name, count: count as number });
            if ((count as number) > maxStratCount) {
                maxStratCount = count as number;
                stat.bestStrategy = name;
            }
        }
        stat.playbooks = playbookArray;

        // Dominant Emotion
        let maxEmoCount = 0;
        let dominantEmo = "Neutral";
        for (const [emo, count] of Object.entries(temp._emotions)) {
            if ((count as number) > maxEmoCount) {
                maxEmoCount = count as number;
                dominantEmo = emo;
            }
        }
        stat.emotion = dominantEmo === "Neutral" && stat.trades > 0 ? dominantEmo : dominantEmo;

        // Clean up best/worst if no trades (though loop won't run if no trades)
        if (stat.bestTrade.pnl === -Infinity) stat.bestTrade = { symbol: "-", pnl: 0 };
        if (stat.worstTrade.pnl === Infinity) stat.worstTrade = { symbol: "-", pnl: 0 };
      });

      return statsByDay;
    }
  });

  return { dailyStats, isLoading, error };
};