import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTrades = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: trades, isLoading, error } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select(`
          *,
          strategies (
            name,
            emoji
          )
        `)
        .order('entry_time', { ascending: false });
      
      if (error) {
        console.error("Error fetching trades:", error);
        throw error;
      }
      
      return data;
    }
  });

  const deleteTradeMutation = useMutation({
    mutationFn: async (tradeId: number) => {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', tradeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Trade deleted",
        description: "The trade has been permanently removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete trade: " + error.message,
        variant: "destructive",
      });
    }
  });

  return { 
    trades, 
    isLoading, 
    error, 
    deleteTrade: deleteTradeMutation.mutate 
  };
};