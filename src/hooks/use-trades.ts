// frontend/src/hooks/use-trades.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Trade, ApiError } from "@/services/api"; // ✅ Added ApiError
import { toast } from "./use-toast";
import { useModal } from "@/contexts/ModalContext"; // ✅ Added Modal Context

/**
 * Trades hook
 * - Pagination-aware
 * - Search-aware
 * - Matches Sidebar prefetch keys exactly
 * - Handles Quota/Plan errors automatically
 */
export const useTrades = (
  page: number = 1, 
  limit: number = 20, 
  search: string = "" 
) => {
  const queryClient = useQueryClient();
  const { openUpgradeModal } = useModal(); // ✅ Get the modal trigger

  // -------------------------
  // Fetch Trades (Paginated)
  // -------------------------
  const query = useQuery({
    // ✅ CRITICAL: This key structure matches Sidebar ["trades", 1, 20, ""]
    queryKey: ["trades", page, limit, search], 
    queryFn: () => api.trades.getAll(page, limit, search),
    
    // Smooth transitions: keep showing old data while fetching new page
    placeholderData: (previousData) => previousData, 
    
    // Cache settings
    staleTime: 1000 * 60 * 1, // Data is "fresh" for 1 minute (no refetch)
  });

  // -------------------------
  // Create Trade
  // -------------------------
  const createTrade = useMutation({
    mutationFn: api.trades.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"], exact: false });
      toast({ title: "Trade Logged", description: "Your trade has been recorded successfully." });
    },
    onError: (error: any) => {
      // ✅ Handle Quota Limit (402)
      if (error instanceof ApiError && error.status === 402) {
        openUpgradeModal(error.message || "Trade limit reached. Upgrade to journal more.");
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    },
  });

  // -------------------------
  // Update Trade
  // -------------------------
  const updateTrade = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Trade> }) =>
      api.trades.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"], exact: false });
      toast({ title: "Trade Updated", description: "Changes have been saved." });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });

  // -------------------------
  // Delete Trade
  // -------------------------
  const deleteTrade = useMutation({
    mutationFn: api.trades.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"], exact: false });
      toast({ title: "Trade Deleted", description: "Trade removed from journal." });
    },
    onError: (error: Error) => {
      toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
    },
  });

  // -------------------------
  // Upload Screenshots
  // -------------------------
  const uploadScreenshots = useMutation({
    mutationFn: ({ files, tradeId }: { files: File[]; tradeId: string }) =>
      api.trades.uploadScreenshots(files, tradeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trades"], exact: false });
      toast({ title: "Screenshots Uploaded", description: "Images successfully attached." });
    },
    onError: (error: any) => {
      // ✅ Handle Feature Lock (403) or Quota (402)
      if (error instanceof ApiError && (error.status === 403 || error.status === 402)) {
        openUpgradeModal(error.message || "Screenshots are a PRO feature. Upgrade to unlock.");
      } else {
        toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
      }
    },
  });

  return {
    trades: query.data?.data || [],
    total: query.data?.total || 0,
    page: query.data?.page || page,
    totalPages: Math.ceil((query.data?.total || 0) / limit),
    isLoading: query.isLoading,
    isFetching: query.isFetching,

    createTrade,
    updateTrade,
    deleteTrade,
    uploadScreenshots,
  };
};