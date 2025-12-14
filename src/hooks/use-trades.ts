// frontend/src/hooks/use-trades.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Trade } from "@/services/api";
import { toast } from "./use-toast";

// ✅ Updated Hook to accept pagination params
export const useTrades = (page: number = 1, limit: number = 20, symbol?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["trades", page, limit, symbol], // ✅ Cache key depends on page
    queryFn: () => api.trades.getAll(page, limit, symbol),
    placeholderData: (previousData) => previousData, // ✅ Keep previous data while fetching new (no flicker)
  });

  const createTrade = useMutation({
    mutationFn: api.trades.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      toast({ title: "Trade Logged", description: "Your trade has been recorded successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateTrade = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Trade> }) => 
      api.trades.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      toast({ title: "Trade Updated", description: "Changes have been saved." });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });

  const deleteTrade = useMutation({
    mutationFn: api.trades.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"] });
      toast({ title: "Trade Deleted", description: "Trade removed from journal." });
    },
    onError: (error: Error) => {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    },
  });

  return {
    trades: query.data?.data || [], // ✅ Access nested data
    total: query.data?.total || 0,  // ✅ Access total count
    page: query.data?.page || 1,
    totalPages: Math.ceil((query.data?.total || 0) / limit),
    isLoading: query.isLoading,
    isFetching: query.isFetching, // Useful for showing background loading spinner
    createTrade,
    updateTrade,
    deleteTrade,
  };
};