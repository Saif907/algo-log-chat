// frontend/src/pages/TradeDetail.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  Upload,
  ArrowLeft,
  Maximize2,
  ExternalLink,
  ImageOff,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { EditTradeModal } from "@/components/trades/EditTradeModal";

export const TradeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [trade, setTrade] = useState<any | null>(null);
  const [relatedTrades, setRelatedTrades] = useState<any[]>([]);
  const [screenshots, setScreenshots] = useState<{ url: string; uploaded_at?: string }[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(true);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(true);
  
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /* Helpers */
  const calculateHoldingTime = (start: string, end?: string | null) => {
    if (!end) return "Open";
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const calculateRisk = (entry: number, stop: number | null, qty: number) => {
    if (!stop) return 0;
    return Math.abs(entry - stop) * qty;
  };

  const calculateRMultiple = (pnl: number, risk: number) => {
    if (!risk || risk === 0) return "0.00";
    return (pnl / risk).toFixed(2);
  };

  /* Data loader */
  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setSecondaryLoading(true);

    try {
      // 1) Fetch Critical Data
      const tradeData = await api.trades.getOne(id);
      setTrade(tradeData);
      
      // Unblock UI
      setLoading(false);

      // 2) Fetch Background Data
      const fetchScreenshots = api.trades.getScreenshots(id)
        .then(ss => setScreenshots(Array.isArray(ss?.files) ? ss.files : []))
        .catch(e => console.warn("Failed to load screenshots", e));

      const fetchRelated = api.trades.getAll(1, 10, tradeData.symbol)
        .then(resp => {
          const relatedFiltered = (resp.data || []).filter((t: any) => t.id !== tradeData.id).slice(0, 3);
          setRelatedTrades(relatedFiltered);
        })
        .catch(e => console.warn("Failed to load related trades", e));

      await Promise.allSettled([fetchScreenshots, fetchRelated]);
      
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Could not fetch trade", variant: "destructive" });
      navigate("/trades");
    } finally {
      setLoading(false);
      setSecondaryLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  /* Handlers */
  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this trade?")) return;
    try {
      await api.trades.delete(id);
      toast({ title: "Deleted", description: "Trade deleted successfully" });
      navigate("/trades");
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to delete trade", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8"><Skeleton className="h-[600px] w-full" /></div>;
  if (!trade) return null;

  /* Derived values */
  const riskAmount = calculateRisk(trade.entry_price, trade.stop_loss, trade.quantity);
  const rMultiple = calculateRMultiple(trade.pnl || 0, riskAmount);
  const holdingTime = calculateHoldingTime(trade.entry_time, trade.exit_time);
  const isProfitable = (trade.pnl || 0) >= 0;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/trades')}
        className="md:hidden -ml-2 mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Trades
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">{trade.symbol}</h1>
              <Badge
                variant="outline"
                className={
                  trade.direction === "LONG"
                    ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border-cyan-500/30"
                    : "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 border-pink-500/30"
                }
              >
                {trade.direction}
              </Badge>
              <Badge variant="outline">{trade.status}</Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {new Date(trade.entry_time).toLocaleDateString()} • {new Date(trade.entry_time).toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">NET P&L</p>
              <p className={`text-2xl sm:text-3xl font-bold ${isProfitable ? "text-success" : "text-destructive"}`}>
                ${isProfitable ? "+" : ""}{(trade.pnl ?? 0).toFixed(2)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                R: {rMultiple}R
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsEditOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EditTradeModal
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) void loadData();
        }}
        // ✅ FIXED: Pass the raw trade object directly
        trade={trade}
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "ENTRY", value: `$${trade.entry_price}` },
          { label: "EXIT", value: trade.exit_price ? `$${trade.exit_price}` : "-" },
          { label: "STOP LOSS", value: trade.stop_loss ? `$${trade.stop_loss}` : "-" },
          { label: "TARGET", value: trade.target ? `$${trade.target}` : "-" },
          { label: "R : R", value: `1 : ${rMultiple}` },
          { label: "RISK", value: `$${riskAmount.toFixed(2)}`, className: "text-destructive" },
          { label: "QUANTITY", value: trade.quantity },
          { label: "HOLD TIME", value: holdingTime },
        ].map((item, idx) => (
          <Card key={idx} className="p-3 sm:p-6">
            <p className="text-[10px] sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{item.label}</p>
            <p className={`text-lg sm:text-2xl font-bold ${item.className || ""}`}>{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Notes & Screenshots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6 flex flex-col">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">TRADE NOTES</h3>
          <div className="bg-muted/30 p-4 rounded-lg flex-1 text-sm whitespace-pre-wrap leading-relaxed min-h-[200px]">
            {trade.encrypted_notes || <span className="text-muted-foreground italic">No notes added.</span>}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">SCREENSHOTS</h3>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => setIsEditOpen(true)}>
              <Upload className="h-3.5 w-3.5" />
              Manage
            </Button>
          </div>

          {secondaryLoading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               <Skeleton className="aspect-video w-full rounded-lg" />
               <Skeleton className="aspect-video w-full rounded-lg" />
             </div>
          ) : screenshots && screenshots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {screenshots.map((s, index) => (
                <div
                  key={index}
                  className="group relative aspect-video bg-muted rounded-lg overflow-hidden border cursor-pointer hover:ring-2 ring-primary/50 transition-all"
                  onClick={() => setSelectedImage(s.url)}
                >
                  <img
                    src={s.url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                       e.currentTarget.style.display = "none";
                       e.currentTarget.parentElement?.classList.add("flex", "items-center", "justify-center");
                       const icon = document.createElement("div");
                       icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="m19 5-7 7-7-7"/><path d="m5 19 7-7 7 7"/></svg>';
                       e.currentTarget.parentElement?.appendChild(icon);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-white h-6 w-6 drop-shadow-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
              <Upload className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No screenshots attached</p>
            </div>
          )}
        </Card>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => { if (!open) setSelectedImage(null); }}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/90 border-none">
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Full Preview"
                className="max-w-full max-h-[85vh] object-contain"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 gap-2 opacity-0 hover:opacity-100 transition-opacity"
                onClick={() => window.open(selectedImage, "_blank")}
              >
                <ExternalLink className="h-4 w-4" /> Open Original
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Strategy & Related */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4">TAGS & STRATEGY</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {trade.tags && trade.tags.length > 0 ? trade.tags.map((tag: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs">
                  {tag}
                </Badge>
              )) : <span className="text-sm text-muted-foreground">No tags</span>}
            </div>

            <div className="pt-2">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Active Playbook</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm py-1">
                  {trade.strategies?.name || "No Strategy Linked"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-semibold">RELATED TRADES ({trade.symbol})</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/trades')} className="text-xs">
              View All
            </Button>
          </div>
          <div className="space-y-1">
            {secondaryLoading ? (
               <>
                 <Skeleton className="h-10 w-full mb-2" />
                 <Skeleton className="h-10 w-full mb-2" />
               </>
            ) : relatedTrades.length > 0 ? relatedTrades.map((relatedTrade) => (
              <div
                key={relatedTrade.id}
                className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => navigate(`/trades/${relatedTrade.id}`)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={
                    relatedTrade.direction === "LONG"
                      ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20 text-[10px] px-1.5"
                      : "bg-pink-500/10 text-pink-500 border-pink-500/20 text-[10px] px-1.5"
                  }>
                    {relatedTrade.direction?.substr(0, 1)}
                  </Badge>
                  <span className="text-sm font-medium">{new Date(relatedTrade.entry_time).toLocaleDateString()}</span>
                </div>
                <span className={`text-sm font-mono font-medium ${
                  (relatedTrade.pnl || 0) >= 0 ? "text-success" : "text-destructive"
                }`}>
                  ${(relatedTrade.pnl || 0) >= 0 ? "+" : ""}{Math.abs(relatedTrade.pnl || 0).toFixed(2)}
                </span>
              </div>
            )) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No other trades found for {trade.symbol}.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};