// frontend/src/hooks/use-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define the exact shape of data returned by your new SQL function
export interface DashboardStats {
  netPL: number;
  winRate: number;
  profitFactor: number | string;
  avgWin: number;
  avgLoss: number;
  cumulativeData: { date: string; value: number }[];
  dailyData: { date: string; value: number }[];
  strategyPerformance: { name: string; value: number }[];
  topInstruments: { symbol: string; direction: string; type: string; pnl: number }[];
  recentTrades: any[];
}

export const useDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    // Unique key for caching. We use 'rpc' to differentiate from the old method
    queryKey: ['dashboard_stats_rpc'], 
    
    queryFn: async () => {
      // 1. Call the secure RPC function we just created in SQL
      const { data, error } = await supabase
        .rpc('get_dashboard_stats');

      if (error) {
        console.error("Error fetching dashboard RPC:", error);
        throw error;
      }

      // 2. Return the data. 
      // We cast it 'as unknown as DashboardStats' because Supabase types 
      // can't automatically know the shape of a custom JSONB return.
      return data as unknown as DashboardStats;
    },
    
    // Optional: Keep data fresh for 5 minutes, but cache it
    staleTime: 1000 * 60 * 5, 
  });

  return {
    stats,
    isLoading,
    error
  };
};