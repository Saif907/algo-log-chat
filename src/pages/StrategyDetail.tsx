// frontend/src/pages/StrategyDetail.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, TrendingUp, TrendingDown, Target } from "lucide-react";
import { TradeCard } from "@/components/trades/TradeCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useCurrency } from "@/contexts/CurrencyContext"; // ✅ Import Context

// ✅ Import the Edit Modal
import { EditStrategyModal } from "@/components/strategies/EditStrategyModal";

export const StrategyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { format, currency } = useCurrency(); // ✅ Use Hook
  
  const [isEditOpen, setIsEditOpen] = useState(false);

  // --- 1. Fetch Strategy Data (React Query) ---
  const { data: strategy, isLoading: isStrategyLoading, isError } = useQuery({
    queryKey: ["strategy", id],
    queryFn: () => api.strategies.getOne(id!),
    enabled: !!id,
  });

  // --- 2. Fetch Related Trades (React Query) ---
  const { data: trades = [], isLoading: isTradesLoading } = useQuery({
    queryKey: ["strategy-trades", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('strategy_id', id)
        .order('entry_time', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // --- Delete Handler ---
  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this strategy? All linked trades will be unlinked.")) return;
    
    try {
      await api.strategies.delete(id);
      queryClient.invalidateQueries({ queryKey: ["strategies"] });
      toast({ title: "Strategy Deleted", description: "Strategy removed successfully." });
      navigate("/strategies");
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to delete strategy.", variant: "destructive" });
    }
  };

  // --- Loading States ---
  if (isStrategyLoading || isTradesLoading) {
    return <div className="p-8"><Skeleton className="h-[400px] w-full rounded-xl" /></div>;
  }

  if (isError || !strategy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-xl font-semibold">Strategy not found</h2>
        <Button onClick={() => navigate('/strategies')}>Return to Strategies</Button>
      </div>
    );
  }

  // --- Metrics Calculation ---
  const totalTrades = trades.length;
  const winners = trades.filter(t => (t.pnl || 0) > 0);
  const losers = trades.filter(t => (t.pnl || 0) <= 0);
  
  const grossProfit = winners.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const grossLoss = Math.abs(losers.reduce((sum, t) => sum + (t.pnl || 0), 0));
  
  const netPL = grossProfit - grossLoss;
  const winRate = totalTrades > 0 ? (winners.length / totalTrades) * 100 : 0;
  
  // Profit Factor Logic
  let profitFactor = 0;
  if (totalTrades > 0) {
      if (grossLoss < 0.01) profitFactor = 100; // No Loss
      else profitFactor = grossProfit / grossLoss;
  }

  const avgWin = winners.length > 0 ? grossProfit / winners.length : 0;
  const avgLoss = losers.length > 0 ? grossLoss / losers.length : 0;
  const expectancy = ((winRate / 100) * avgWin) - ((1 - (winRate / 100)) * avgLoss);

  // Helper for Trade Card
  const mapTradeToCard = (trade: any) => ({
    id: trade.id,
    symbol: trade.symbol,
    direction: trade.direction,
    entry: { 
      date: new Date(trade.entry_time).toLocaleDateString(), 
      time: new Date(trade.entry_time).toLocaleTimeString(), 
      price: trade.entry_price 
    },
    exit: { 
      date: trade.exit_time ? new Date(trade.exit_time).toLocaleDateString() : "-", 
      time: trade.exit_time ? new Date(trade.exit_time).toLocaleTimeString() : "-", 
      price: trade.exit_price || 0 
    },
    pl: trade.pnl || 0,
    playbook: strategy.name,
    tags: trade.tags || [],
  });

  const rules = (strategy.rules as any) || { market: [], entry: [], exit: [], risk: [] };

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-6 space-y-6 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/strategies')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 text-xl shadow-sm border border-border/50">
                    {strategy.emoji || "📈"}
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{strategy.name}</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{strategy.description || "No description provided."}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="px-2.5 py-0.5">{strategy.style || "General"}</Badge>
                {strategy.instrument_types?.map((inst: string) => (
                  <Badge key={inst} variant="outline" className="text-xs">{inst}</Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsEditOpen(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ✅ Edit Modal */}
        <EditStrategyModal 
            open={isEditOpen} 
            onOpenChange={setIsEditOpen} 
            strategyId={id} 
        />

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTrades}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${winRate >= 50 ? "text-success" : "text-muted-foreground"}`}>
                {winRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net P&L ({currency})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${netPL >= 0 ? "text-success" : "text-destructive"}`}>
                {/* ✅ Use Format */}
                {netPL >= 0 ? "+" : ""}{format(Math.abs(netPL))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profit Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{profitFactor.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expectancy</p>
                <p className={`text-xl font-semibold ${expectancy > 0 ? "text-success" : ""}`}>
                    {/* ✅ Use Format */}
                    {format(expectancy)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Winner</p>
                <p className="text-xl font-semibold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {/* ✅ Use Format */}
                  +{format(avgWin)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Loser</p>
                <p className="text-xl font-semibold text-destructive flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  {/* ✅ Use Format */}
                  -{format(avgLoss)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(rules).map(([category, ruleList]: [string, any]) => (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg capitalize flex items-center gap-2">
                        {category} Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(ruleList) && ruleList.length > 0 ? (
                      <ul className="space-y-3">
                        {ruleList.map((rule: string, index: number) => (
                          <li key={index} className="flex items-start gap-2.5">
                            <div className="min-w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                            <span className="text-sm leading-relaxed">{rule}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">No {category} rules defined.</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trades" className="space-y-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Trades Using This Strategy</h3>
            </div>
            <div className="space-y-3">
              {trades.length > 0 ? trades.map((trade) => (
                <TradeCard 
                  key={trade.id} 
                  trade={mapTradeToCard(trade)} 
                  onClick={() => navigate(`/trades/${trade.id}`)}
                />
              )) : (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-muted rounded-xl bg-muted/5">
                  <Target className="w-10 h-10 mb-3 opacity-20" />
                  <p>No trades logged with this strategy yet.</p>
                  <Button variant="link" onClick={() => navigate('/trades')} className="mt-2">
                    Go to Trades to log one
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                 <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                        AI insights will automatically analyze your execution patterns once you have logged at least 5 trades with this strategy.
                    </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};