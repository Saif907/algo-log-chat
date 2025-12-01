import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { TradeCard } from "@/components/trades/TradeCard";

// Mock data - in real app would come from database
const mockStrategyDetail = {
  id: 1,
  emoji: "🧅",
  name: "Onion",
  description: "High-probability breakout strategy focused on morning range breakouts with strong volume confirmation.",
  color: "#8b5cf6",
  style: "Day Trading",
  instruments: ["Stocks", "Options"],
  trades: 18,
  winRate: 94,
  netPL: 13202.40,
  profitFactor: 14.61,
  expectancy: 733.47,
  avgWinner: 833.65,
  avgLoser: -969.72,
  largestWin: 2450.00,
  largestLoss: -1200.00,
  rules: {
    market: ["Pre-market volume > 2M shares", "Price above VWAP", "Market showing bullish bias"],
    entry: ["Break above opening range high", "Volume surge on breakout", "Price holding above key level"],
    exit: ["Hit profit target (2R)", "Break below VWAP", "Time stop at 11:30 AM"],
    risk: ["Max 1% account risk per trade", "Position size based on ATR", "Stop below opening range low"]
  },
  recentTrades: [
    { 
      id: 1, 
      symbol: "TSLA", 
      direction: "Long", 
      instrument: "Stock",
      account: "TD Ameritrade",
      entry: { date: "2024-03-15", time: "09:35", price: 180.50 },
      exit: { date: "2024-03-15", time: "10:45", price: 185.75 },
      holdingTime: "1h 10m",
      pl: 1250.50, 
      rMultiple: 3.2, 
      returnPct: 2.91,
      playbook: "Onion", 
      mistakes: 0,
      notes: 2,
      tags: ["breakout", "high-volume"]
    },
    { 
      id: 2, 
      symbol: "NVDA", 
      direction: "Long", 
      instrument: "Stock",
      account: "TD Ameritrade",
      entry: { date: "2024-03-14", time: "09:45", price: 875.20 },
      exit: { date: "2024-03-14", time: "11:30", price: 883.10 },
      holdingTime: "1h 45m",
      pl: 890.20, 
      rMultiple: 2.5, 
      returnPct: 0.90,
      playbook: "Onion", 
      mistakes: 0,
      notes: 1,
      tags: ["morning", "momentum"]
    },
    { 
      id: 3, 
      symbol: "AAPL", 
      direction: "Long", 
      instrument: "Stock",
      account: "TD Ameritrade",
      entry: { date: "2024-03-13", time: "10:15", price: 172.80 },
      exit: { date: "2024-03-13", time: "10:35", price: 170.50 },
      holdingTime: "20m",
      pl: -450.00, 
      rMultiple: -1.0, 
      returnPct: -1.33,
      playbook: "Onion", 
      mistakes: 1,
      notes: 3,
      tags: ["failed-breakout"]
    },
  ],
  aiInsights: {
    strengths: [
      "Excellent at catching early morning momentum",
      "Strong discipline on stop losses",
      "High win rate with consistent position sizing"
    ],
    weaknesses: [
      "Struggles in choppy, low-volume conditions",
      "Occasional premature entries before volume confirmation",
      "Could improve profit-taking timing"
    ],
    psychology: [
      "Most confident trades are taken in first 30 minutes",
      "Tends to skip trades when market opens flat",
      "Less emotional attachment leads to better execution"
    ]
  }
};

export const StrategyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [strategy] = useState(mockStrategyDetail);

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/strategies')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{strategy.emoji}</span>
                <h1 className="text-3xl font-bold">{strategy.name}</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">{strategy.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{strategy.style}</Badge>
                {strategy.instruments.map((instrument) => (
                  <Badge key={instrument} variant="outline">{instrument}</Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
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
              <div className="text-3xl font-bold">{strategy.trades}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{strategy.winRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">${strategy.netPL.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profit Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{strategy.profitFactor.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Expectancy</p>
                <p className="text-xl font-semibold">${strategy.expectancy.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Winner</p>
                <p className="text-xl font-semibold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  ${strategy.avgWinner.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Loser</p>
                <p className="text-xl font-semibold text-destructive flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  ${strategy.avgLoser.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Largest Win</p>
                <p className="text-xl font-semibold text-success">${strategy.largestWin.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Largest Loss</p>
                <p className="text-xl font-semibold text-destructive">${strategy.largestLoss.toFixed(2)}</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market State / Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strategy.rules.market.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Entry Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strategy.rules.entry.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exit / Target Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strategy.rules.exit.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-destructive mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk / Management Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {strategy.rules.risk.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades" className="space-y-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">All Trades Using This Strategy</h3>
              <p className="text-sm text-muted-foreground">{strategy.recentTrades.length} total trades</p>
            </div>
            <div className="space-y-3">
              {strategy.recentTrades.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {strategy.aiInsights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                      <span className="text-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {strategy.aiInsights.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                      <span className="text-foreground">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Psychology & Behavior Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {strategy.aiInsights.psychology.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-foreground">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};