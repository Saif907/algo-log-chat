import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Filter, Search, Copy, Heart, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { AddTradeModal } from "@/components/trades/AddTradeModal";
import { TradeCard } from "@/components/trades/TradeCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const mockTrades = [
  {
    id: 1,
    symbol: "TSLA",
    direction: "Long",
    instrument: "Stock",
    account: "TD Ameritrade",
    entry: { date: "Nov 22, 2025", time: "09:32", price: 245.5 },
    exit: { date: "Nov 22, 2025", time: "12:05", price: 252.3 },
    holdingTime: "2h 35m",
    pl: 680.00,
    rMultiple: 2.8,
    returnPct: 2.77,
    playbook: "ORB Breakout",
    mistakes: 2,
    notes: 3,
    tags: ["Momentum", "Follow Plan"],
  },
  {
    id: 2,
    symbol: "NVDA",
    direction: "Long",
    instrument: "Stock",
    account: "TD Ameritrade",
    entry: { date: "Nov 21, 2025", time: "10:15", price: 485.2 },
    exit: { date: "Nov 21, 2025", time: "14:30", price: 488.9 },
    holdingTime: "4h 15m",
    pl: 185.00,
    rMultiple: 1.2,
    returnPct: 0.76,
    playbook: "Pullback Entry",
    mistakes: 1,
    notes: 2,
    tags: ["Tech", "Patient"],
  },
  {
    id: 3,
    symbol: "BANKNIFTY",
    direction: "Short",
    instrument: "Options",
    account: "Zerodha",
    entry: { date: "Nov 21, 2025", time: "09:18", price: 145.5 },
    exit: { date: "Nov 21, 2025", time: "10:45", price: 138.2 },
    holdingTime: "1h 27m",
    pl: -1460.00,
    rMultiple: -1.5,
    returnPct: -5.02,
    playbook: "No playbook",
    mistakes: 4,
    notes: 2,
    tags: ["FOMO", "Revenge"],
  },
];

export const Trades = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isAddTradeOpen, setIsAddTradeOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen pb-32">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
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
                <Select defaultValue="all-accounts">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-accounts">All Accounts</SelectItem>
                    <SelectItem value="td">TD Ameritrade</SelectItem>
                    <SelectItem value="zerodha">Zerodha</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-instruments">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-instruments">All Instruments</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="options">Options</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-directions">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-directions">All Directions</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-playbooks">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-playbooks">All Playbooks</SelectItem>
                    <SelectItem value="orb">ORB Breakout</SelectItem>
                    <SelectItem value="pullback">Pullback Entry</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
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
                    <TableHead className="min-w-[80px]">Side</TableHead>
                    <TableHead className="min-w-[120px]">P/L</TableHead>
                    <TableHead className="min-w-[100px]">R-Multiple</TableHead>
                    <TableHead className="min-w-[140px]">Playbook</TableHead>
                    <TableHead className="min-w-[200px]">Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTrades.map((trade) => (
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
                          className={trade.direction === "Long" 
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
                          {trade.rMultiple > 0 ? "+" : ""}{trade.rMultiple.toFixed(1)}R
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
                          {trade.tags.slice(0, 3).map((tag, idx) => (
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
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination inside table card */}
            <div className="border-t border-border/50 p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Showing 3 of 5 trades</p>
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
          {mockTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} onClick={() => navigate(`/trades/${trade.id}`)} />
          ))}
          
          {/* Mobile Pagination */}
          <Card className="p-4 bg-card border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">Showing 3 of 5 trades</p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" disabled className="flex-1 sm:flex-none">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sm:inline">Previous</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <span className="sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        </div>
      </div>

      <AddTradeModal open={isAddTradeOpen} onOpenChange={setIsAddTradeOpen} />
    </div>
  );
};
