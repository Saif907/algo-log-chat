// frontend/src/pages/trades.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Filter, Search, ChevronLeft, ChevronRight, Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AddTradeModal } from "@/components/trades/AddTradeModal";
import { TradeCard } from "@/components/trades/TradeCard";
import { useTrades } from "@/hooks/use-trades";
import { Skeleton } from "@/components/ui/skeleton";
import { api, ApiError } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// ✅ Import Contexts
import { useModal } from "@/contexts/ModalContext";
import { useAuth } from "@/contexts/AuthContext";

export const Trades = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { openUpgradeModal } = useModal();
  
  // ✅ USE GLOBAL PLAN
  const { plan } = useAuth();
  
  // --- Pagination & Filter State ---
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filter State
  const [filterInstrument, setFilterInstrument] = useState("all-instruments");
  const [filterDirection, setFilterDirection] = useState("all-directions");

  // ✅ Fetch Paginated Data
  const { trades, total, totalPages, isLoading, isFetching } = useTrades(page, pageSize, search);

  // --- 🛡️ SIMPLIFIED PLAN CHECK ---
  const userPlan = (plan || "FREE").toUpperCase();
  const isPro = userPlan === "PRO" || userPlan === "FOUNDER";
  
  // Define Limits
  const TRADE_LIMIT_FREE = 100;

  // ✅ Handle "Add Trade" Click
  const handleAddTradeClick = () => {
    // Check if free user exceeded limit
    if (!isPro && total >= TRADE_LIMIT_FREE) {
        openUpgradeModal(`You have reached the ${TRADE_LIMIT_FREE} trade limit for the Free plan. Upgrade to log unlimited trades.`);
        return;
    }
    setIsAddTradeOpen(true);
  };

  // ✅ Handle CSV Export with Permission Check
  const handleExport = async () => {
    // 1. Check Plan Logic Client-Side First (Fast Feedback)
    if (!isPro) {
        openUpgradeModal("Exporting data to CSV is a Pro feature.");
        return;
    }

    try {
      setIsExporting(true);
      const blob = await api.trades.export();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trades_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({ title: "Success", description: "Trades exported successfully." });
    } catch (error: any) {
      // 2. Catch Backend 403 just in case
      if (error instanceof ApiError && error.status === 403) {
          openUpgradeModal("Exporting data to CSV is a Pro feature.");
      } else {
          toast({ title: "Export Failed", description: "Could not download trades.", variant: "destructive" });
      }
    } finally {
      setIsExporting(false);
    }
  };

  // --- Format Helpers ---
  const formatDate = (isoString: string | null) => {
    if (!isoString) return { date: "-", time: "-" };
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  const calculateRMultiple = (pnl: number, entry: number, stop: number | null, qty: number) => {
    if (!stop || stop === 0) return 0;
    const riskPerShare = Math.abs(entry - stop);
    const totalRisk = riskPerShare * qty;
    if (totalRisk === 0) return 0;
    return pnl / totalRisk;
  };

  const mapTradeToCard = (trade: any) => {
    const entry = formatDate(trade.entry_time);
    const exit = formatDate(trade.exit_time);
    
    const entryPrice = Number(trade.entry_price || 0);
    const exitPrice = Number(trade.exit_price || 0);
    const quantity = Number(trade.quantity || 0);
    const pnl = Number(trade.pnl || 0);
    const stopLoss = trade.stop_loss ? Number(trade.stop_loss) : null;

    const rMultiple = calculateRMultiple(pnl, entryPrice, stopLoss, quantity);

    return {
      id: trade.id,
      symbol: trade.symbol,
      direction: trade.direction, 
      instrument_type: trade.instrument_type || "STOCK",
      status: trade.status,
      entry: { 
        date: entry.date, 
        time: entry.time, 
        price: entryPrice 
      },
      exit: { 
        date: exit.date, 
        time: exit.time, 
        price: exitPrice 
      },
      quantity: quantity,
      pl: pnl,
      rMultiple: rMultiple,
      playbook: trade.strategies?.name || "No playbook",
      tags: trade.tags || [],
    };
  };

  // --- Filtering Logic ---
  const processedTrades = (trades || [])
    .map(mapTradeToCard)
    .filter((trade) => {
      if (activeTab === "winning" && trade.pl <= 0) return false;
      if (activeTab === "losing" && trade.pl >= 0) return false;
      if (filterInstrument !== "all-instruments" && trade.instrument_type !== filterInstrument.toUpperCase()) return false;
      if (filterDirection !== "all-directions" && trade.direction.toLowerCase() !== filterDirection.toLowerCase()) return false;
      return true;
    });

  return (
    <div className="min-h-screen pb-32 animate-in fade-in duration-500">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Trades</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage and analyze your trading history</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {/* ✅ CSV Export Button with PRO Logic */}
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none relative group" 
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                ) : !isPro ? (
                   // Locked State Icon for Free Users
                   <Lock className="h-3.5 w-3.5 sm:mr-2 text-amber-600" />
                ) : (
                   // Normal Icon for PRO/FOUNDER
                   <Download className="h-4 w-4 sm:mr-2" />
                )}
                
                <span className="hidden sm:inline">Export</span>
                
                {/* Pro Badge Overlay for Free Users */}
                {!isPro && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                        PRO
                    </span>
                )}
              </Button>

              {/* ✅ Add Trade Button with Limit Check */}
              <Button 
                className="flex-1 sm:flex-none bg-[#00d4ff] hover:bg-[#00b8e0] text-black"
                onClick={handleAddTradeClick}
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Trade</span>
              </Button>
            </div>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={(v) => { 
                setActiveTab(v); 
                setPage(1); // ✅ Reset page on tab switch
            }}
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">All Trades</TabsTrigger>
              <TabsTrigger value="winning" className="flex-1 sm:flex-none">Winning</TabsTrigger>
              <TabsTrigger value="losing" className="flex-1 sm:flex-none">Losing</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Collapsible Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <Card className="bg-card border-border/50">
              <CollapsibleTrigger className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-90" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-4 border-t border-border/50">
                  {/* Symbol Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search symbol..." 
                      className="pl-9" 
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); 
                      }}
                    />
                  </div>
                  
                  <Select 
                    value={filterInstrument} 
                    onValueChange={(v) => {
                        setFilterInstrument(v);
                        setPage(1); // ✅ Reset page on filter switch
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Instrument" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-instruments">All Instruments</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="futures">Futures</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filterDirection} 
                    onValueChange={(v) => {
                        setFilterDirection(v);
                        setPage(1); // ✅ Reset page on filter switch
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Direction" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-directions">All Directions</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card className="bg-card border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="min-w-[100px]">Symbol</TableHead>
                      <TableHead className="min-w-[80px]">Type</TableHead>
                      <TableHead className="min-w-[80px]">Side</TableHead>
                      <TableHead className="min-w-[120px]">P/L</TableHead>
                      <TableHead className="min-w-[100px]">R-Multiple</TableHead>
                      <TableHead className="min-w-[140px]">Strategy</TableHead>
                      <TableHead className="min-w-[200px]">Tags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                       // Skeleton Rows
                       Array.from({ length: 5 }).map((_, i) => (
                         <TableRow key={i}>
                           <TableCell colSpan={8}><Skeleton className="h-10 w-full" /></TableCell>
                         </TableRow>
                       ))
                    ) : processedTrades.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No trades found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      processedTrades.map((trade) => (
                        <TableRow 
                          key={trade.id} 
                          className={`border-border/50 cursor-pointer transition-colors ${
                            trade.pl > 0 ? 'hover:bg-success/5 border-l-2 border-l-success' : 'hover:bg-destructive/5 border-l-2 border-l-destructive'
                          }`}
                          onClick={() => navigate(`/trades/${trade.id}`)}
                        >
                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="font-medium">{trade.entry.date}</div>
                              <div className="text-xs text-muted-foreground">{trade.entry.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold">{trade.symbol}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-medium">
                              {trade.instrument_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={trade.direction === "LONG" 
                                ? "bg-success/10 text-success border-success/30" 
                                : "bg-destructive/10 text-destructive border-destructive/30"
                              }
                            >
                              {trade.direction}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className={`font-semibold ${trade.pl > 0 ? "text-success" : "text-destructive"}`}>
                              {trade.pl > 0 ? "+" : ""}${Math.abs(trade.pl).toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`font-medium ${trade.rMultiple > 0 ? "text-success" : "text-destructive"}`}>
                              {trade.rMultiple !== 0 ? (
                                <>{trade.rMultiple > 0 ? "+" : ""}{trade.rMultiple.toFixed(1)}R</>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {trade.playbook !== "No playbook" && (
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              )}
                              <span className={trade.playbook === "No playbook" ? "text-muted-foreground text-sm" : "text-sm"}>
                                {trade.playbook}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {trade.tags.slice(0, 3).map((tag: string, idx: number) => (
                                <Badge 
                                  key={idx} 
                                  variant="secondary" 
                                  className="text-xs bg-muted/50 hover:bg-muted"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination Controls */}
              <div className="border-t border-border/50 p-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} trades
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || isLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {isLoading ? (
               Array.from({ length: 3 }).map((_, i) => (
                 <Skeleton key={i} className="h-40 w-full rounded-xl" />
               ))
            ) : (
               processedTrades.map((trade) => (
                 <TradeCard key={trade.id} trade={trade} onClick={() => navigate(`/trades/${trade.id}`)} />
               ))
            )}
            
            {/* Mobile Pagination */}
            <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    Prev
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                    Next
                </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Fetch Indicator */}
      {isFetching && !isLoading && (
           <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur border p-2 rounded-full shadow-lg animate-pulse z-50">
               <Loader2 className="h-4 w-4 animate-spin text-primary" />
           </div>
      )}

      
      <AddTradeModal open={isAddTradeOpen} onOpenChange={setIsAddTradeOpen} />
    </div>
  );
};