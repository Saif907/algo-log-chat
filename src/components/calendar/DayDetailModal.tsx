import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DayDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  data?: {
    trades: number;
    pnl: number;
    winRate: number;
    totalR: number;
    emotion: string;
    playbooks: { name: string; count: number }[];
    bestTrade: { symbol: string; pnl: number };
    worstTrade: { symbol: string; pnl: number };
    tradesList: Array<{
      id: string;
      symbol: string;
      direction: string;
      entry: number;
      exit: number;
      pnl: number;
    }>;
  };
}

export const DayDetailModal = ({ open, onOpenChange, date, data }: DayDetailModalProps) => {
  if (!date || !data) return null;

  const formattedDate = date.toLocaleDateString("en-US", { 
    weekday: "long", 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });

  const isProfit = data.pnl > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="text-2xl">{formattedDate}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total P/L</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${isProfit ? "text-success" : "text-destructive"}`}>
                    ${isProfit ? "+" : ""}{data.pnl.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.winRate}%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total R</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.totalR}R</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Emotion</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{data.emotion}</Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Playbook Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.playbooks.map((pb, idx) => (
                    <Badge key={idx} variant="outline">
                      {pb.name} <span className="ml-1 font-bold">×{pb.count}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <TrendingUp className="h-5 w-5" />
                    Best Trade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="font-semibold">{data.bestTrade.symbol}</div>
                    <div className="text-success text-xl font-bold">
                      +${data.bestTrade.pnl.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <TrendingDown className="h-5 w-5" />
                    Worst Trade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="font-semibold">{data.worstTrade.symbol}</div>
                    <div className="text-destructive text-xl font-bold">
                      ${data.worstTrade.pnl.toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.tradesList.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant={trade.direction === "Long" ? "default" : "secondary"}>
                          {trade.direction}
                        </Badge>
                        <span className="font-semibold">{trade.symbol}</span>
                        <span className="text-sm text-muted-foreground">
                          ${trade.entry} → ${trade.exit}
                        </span>
                      </div>
                      <span className={trade.pnl > 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                        ${trade.pnl > 0 ? "+" : ""}{trade.pnl.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">AI analysis will appear here once implemented.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mistakes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mistakes & Learnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Track your mistakes and learnings here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
