import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { api, CreateStrategyInput } from "@/services/api"; // ✅ Import correctly
import { useToast } from "@/hooks/use-toast";

// Interface for the DB View (Dashboard Stats)
export interface StrategyOverview {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color_hex: string;
  style: string;
  stats: {
    totalTrades: number;
    netPL: number;
    winRate: number;
    profitFactor: number;
    avgWinner: number;
    avgLoser: number;
  };
}

export const useStrategies = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. READS: Go to Supabase RPC (Fastest)
  const { data: strategies, isLoading, error } = useQuery({
    queryKey: ['strategies_overview'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_strategies_overview');
      if (error) throw error;
      return data as unknown as StrategyOverview[];
    }
  });

  // 2. WRITES: Go to Python API (Validation)
  const createStrategyMutation = useMutation({
    // ✅ Type check passes now because CreateStrategyInput matches api.ts
    mutationFn: (newStrategy: CreateStrategyInput) => api.strategies.create(newStrategy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies_overview'] });
      toast({ title: "Strategy Created", description: "Your playbook is ready." });
    },
    onError: (error: any) => {
      // 402 errors are handled by the UI Modal, so ignore them here
      if (error?.status !== 402) {
        toast({ 
          title: "Error", 
          description: error.message || "Failed to create strategy.", 
          variant: "destructive" 
        });
      }
    }
  });
// ✅ NEW: Update Mutation
  const updateStrategyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateStrategyInput> }) => 
      api.strategies.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies_overview'] });
      // Also invalidate the specific strategy detail query
      queryClient.invalidateQueries({ queryKey: ['strategy_detail'] });
      toast({ title: "Strategy Updated", description: "Changes saved successfully." });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update strategy.", 
        variant: "destructive" 
      });
    }
  });

  const deleteStrategyMutation = useMutation({
    mutationFn: (id: string) => api.strategies.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies_overview'] });
      toast({ title: "Deleted", description: "Strategy removed." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    strategies,
    isLoading,
    error,
    createStrategy: createStrategyMutation.mutateAsync,
    deleteStrategy: deleteStrategyMutation.mutate,
    updateStrategy: updateStrategyMutation.mutateAsync,
  };
};