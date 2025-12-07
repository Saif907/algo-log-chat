import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChatInput } from "@/components/ChatInput";
import { AddTradeModal } from "@/components/trades/AddTradeModal";
import { TradeCard } from "@/components/trades/TradeCard";
import { useTrades } from "@/hooks/use-trades";
import { Skeleton } from "@/components/ui/skeleton";

export const Trades = () => {
  const navigate = useNavigate();
  const { trades, isLoading } = useTrades();
  const [activeTab, setActiveTab] = useState("all");
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const formatDate = (isoString: string | null) => {
    if (!isoString) return { date: "-", time: "-" };
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  // Helper to calculate R-Multiple dynamically
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
    
    // Calculate derived metrics
    const rMultiple = calculateRMultiple(
      trade.pnl || 0, 
      trade.entry_price, 
      trade.stop_loss, 
      trade.quantity
    );

    return {
      id: trade.id,
      symbol: trade.symbol,
      direction: trade.direction, // "LONG" or "SHORT" from DB
      entry: { date: entry.date, time: entry.time, price: trade.entry_price },
      exit: { date: exit.date, time: exit.time, price: trade.exit_price || 0 },
      pl: trade.pnl || 0,
      rMultiple: rMultiple,
      playbook: trade.strategies?.name || "No playbook",
      tags: trade.tags || [],
    };
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  const tradeList = trades?.map(mapTradeToCard) || [];

  return (
    <div className="min-h-screen pb-32">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Trades</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage and analyze your trading history</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button 
                className="flex-1 sm:flex-none bg-[#00d4ff] hover:bg-[#00b8e0] text-black"
                onClick={() => setIsAddTradeOpen(true)}
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Trade</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">All Trades</TabsTrigger>
              <TabsTrigger value="winning" className="flex-1 sm:flex-none">Winning</TabsTrigger>
              <TabsTrigger value="losing" className="flex-1 sm:flex-none">Losing</TabsTrigger>
            </TabsList>
          </Tabs>

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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search symbol..." className="pl-9" />
                  </div>
                  <Select defaultValue="all-instruments">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-instruments">All Instruments</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-directions">
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

          {/* Desktop Table View - Restored Original Design */}
          <div className="hidden lg:block">
            <Card className="bg-card border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="min-w-[120px]">Date</TableHead>
                      <TableHead className="min-w-[100px]">Symbol</TableHead>
                      <TableHead className="min-w-[80px]">Side</TableHead>
                      <TableHead className="min-w-[120px]">P/L</TableHead>
                      <TableHead className="min-w-[100px]">R-Multiple</TableHead>
                      <TableHead className="min-w-[140px]">Playbook</TableHead>
                      <TableHead className="min-w-[200px]">Tags</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tradeList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No trades found. Start by adding one!
                        </TableCell>
                      </TableRow>
                    ) : (
                      tradeList.map((trade) => (
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
                              {trade.pl > 0 ? "+" : ""}${trade.pl.toFixed(2)}
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
              
              {/* Pagination */}
              <div className="border-t border-border/50 p-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing {tradeList.length} trades</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {tradeList.map((trade) => (
              <TradeCard key={trade.id} trade={trade} onClick={() => navigate(`/trades/${trade.id}`)} />
            ))}
          </div>
        </div>
      </div>
      
      <ChatInput placeholder="Ask about your trades or trade details..." />
      <AddTradeModal open={isAddTradeOpen} onOpenChange={setIsAddTradeOpen} />
    </div>
  );
};