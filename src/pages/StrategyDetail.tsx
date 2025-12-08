import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { TradeCard } from "@/components/trades/TradeCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export const StrategyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [strategy, setStrategy] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Strategy and Related Trades
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // 1. Get Strategy Details
      const { data: stratData, error: stratError } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', id)
        .single();

      if (stratError) {
        toast({ title: "Error", description: "Strategy not found", variant: "destructive" });
        navigate('/strategies');
        return;
      }

      // 2. Get Trades for this Strategy
      const { data: tradeData, error: tradeError } = await supabase
        .from('trades')
        .select('*')
        .eq('strategy_id', id)
        .order('entry_time', { ascending: false });

      setStrategy(stratData);
      setTrades(tradeData || []);
      setLoading(false);
    };

    fetchData();
  }, [id, navigate, toast]);

  if (loading) return <div className="p-8"><Skeleton className="h-[600px]" /></div>;
  if (!strategy) return null;

  // Calculate Metrics
  const totalTrades = trades.length;
  const winners = trades.filter(t => (t.pnl || 0) > 0);
  const losers = trades.filter(t => (t.pnl || 0) <= 0);
  
  // Calculate Gross Profit and Gross Loss directly
  const grossProfit = winners.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const grossLoss = Math.abs(losers.reduce((sum, t) => sum + (t.pnl || 0), 0));
  
  const netPL = grossProfit - grossLoss;
  const winRate = totalTrades > 0 ? (winners.length / totalTrades) * 100 : 0;
  
  // Standard Profit Factor Calculation: Gross Profit / Gross Loss
  const profitFactor = grossLoss > 0 
    ? grossProfit / grossLoss 
    : grossProfit > 0 ? 999 : 0;

  // Averages for display
  const avgWin = winners.length > 0 ? grossProfit / winners.length : 0;
  // Use absolute value for Avg Loser display to match standard conventions (e.g. "Avg Loser: $50")
  const avgLoss = losers.length > 0 ? grossLoss / losers.length : 0;

  // Expectancy = (Win % * Avg Win) - (Loss % * Avg Loss)
  const expectancy = ((winRate / 100) * avgWin) - ((1 - (winRate / 100)) * avgLoss);

  // Helper for Trade Card Mapping
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

  // Parse Rules (JSONB)
  const rules = (strategy.rules as any) || { market: [], entry: [], exit: [], risk: [] };

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/strategies')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{strategy.emoji}</span>
                <h1 className="text-3xl font-bold">{strategy.name}</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">{strategy.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{strategy.style || "General"}</Badge>
                {strategy.instrument_types?.map((inst: string) => (
                  <Badge key={inst} variant="outline">{inst}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
              <div className="text-3xl font-bold text-success">{winRate.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${netPL >= 0 ? "text-success" : "text-destructive"}`}>
                ${netPL.toFixed(2)}
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
                <p className="text-xl font-semibold">${expectancy.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Winner</p>
                <p className="text-xl font-semibold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  ${avgWin.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Loser</p>
                <p className="text-xl font-semibold text-destructive flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  -${avgLoss.toFixed(2)}
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
              {/* Dynamically map rule categories */}
              {Object.entries(rules).map(([category, ruleList]: [string, any]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{category} Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Array.isArray(ruleList) && ruleList.length > 0 ? (
                      <ul className="space-y-2">
                        {ruleList.map((rule: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No rules defined.</p>
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
                <div className="text-center py-10 text-muted-foreground">
                  No trades logged with this strategy yet.
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
                <p className="text-muted-foreground">
                   AI insights will be generated here once you have logged at least 5 trades with this strategy.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};