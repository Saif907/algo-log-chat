// src/hooks/use-strategies.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStrategies = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: strategies, isLoading, error } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      // Fetch strategies and join with trades to calculate simplified stats on the fly
      const { data, error } = await supabase
        .from('strategies')
        .select(`
          *,
          trades (
            pnl,
            status
          )
        `)
        .order('name', { ascending: true });
      
      if (error) {
        console.error("Error fetching strategies:", error);
        throw error;
      }
      
      return data;
    }
  });

  const createStrategyMutation = useMutation({
    mutationFn: async (newStrategy: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('strategies')
        .insert({ ...newStrategy, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({ title: "Strategy created", description: "Your new playbook is ready." });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: "Failed to create strategy: " + error.message, 
        variant: "destructive" 
      });
    }
  });

  const deleteStrategyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('strategies').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({ title: "Strategy deleted", description: "Strategy removed successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    strategies,
    isLoading,
    error,
    createStrategy: createStrategyMutation.mutateAsync, // Using mutateAsync for await capability
    deleteStrategy: deleteStrategyMutation.mutate
  };
};