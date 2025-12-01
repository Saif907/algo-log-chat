import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Trash2, Edit, TrendingUp } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";

const mockStrategies = [
  {
    id: 1,
    emoji: "🧅",
    name: "Onion",
    trades: 18,
    winRate: 94,
    netPL: 13202.40,
    profitFactor: 14.61,
    missedTrades: 0,
    expectancy: 733.47,
    avgWinner: 833.65,
    avgLoser: -969.72,
  },
  {
    id: 2,
    emoji: "🥬",
    name: "celery",
    trades: 10,
    winRate: 70,
    netPL: 1994.80,
    profitFactor: 2.43,
    missedTrades: 0,
    expectancy: 199.48,
    avgWinner: 484.39,
    avgLoser: -465.31,
  },
  {
    id: 3,
    emoji: "💎",
    name: "Breakout",
    trades: 7,
    winRate: 71,
    netPL: 5776.12,
    profitFactor: 3.80,
    missedTrades: 0,
    expectancy: 825.16,
    avgWinner: 1567.11,
    avgLoser: -1029.72,
  },
  {
    id: 4,
    emoji: "😊",
    name: "TTE Playbook",
    trades: 0,
    winRate: 0,
    netPL: 0,
    profitFactor: 0,
    missedTrades: 0,
    expectancy: 0,
    avgWinner: 0,
    avgLoser: 0,
  },
  {
    id: 5,
    emoji: "🥬",
    name: "Inverted Celery",
    trades: 3,
    winRate: 100,
    netPL: 0,
    profitFactor: 0,
    missedTrades: 0,
    expectancy: 0,
    avgWinner: 0,
    avgLoser: 0,
  },
  {
    id: 6,
    emoji: "💅",
    name: "The Fade",
    trades: 3,
    winRate: 67,
    netPL: 0,
    profitFactor: 0,
    missedTrades: 0,
    expectancy: 0,
    avgWinner: 0,
    avgLoser: 0,
  },
];

export const Strategies = () => {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<number | null>(null);
  const [ruleGroups, setRuleGroups] = useState([
    { id: 1, name: "Market State / Conditions", rules: [] as string[] },
    { id: 2, name: "Entry Rules", rules: [] as string[] },
    { id: 3, name: "Exit / Target Rules", rules: [] as string[] },
    { id: 4, name: "Risk / Management Rules", rules: [] as string[] },
  ]);

  const handleDeleteStrategy = (id: number) => {
    // In real app, would delete from database
    console.log("Deleting strategy:", id);
  };

  const handleEditStrategy = (id: number) => {
    setEditingStrategy(id);
    setIsCreateOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6 lg:px-8">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Strategies</h1>
            <p className="text-muted-foreground">Create and manage your trading strategy templates</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#00d4ff] hover:bg-[#00b8e0] text-black">
                <Plus className="h-4 w-4 mr-2" />
                New Strategy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Strategy</DialogTitle>
                <p className="text-sm text-muted-foreground">Define your trading strategy with rules and criteria</p>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Strategy Name *</Label>
                    <Input placeholder="e.g. Morning Breakout Strategy" className="border-[#00d4ff] focus-visible:ring-[#00d4ff]" />
                  </div>
                  <div className="space-y-2">
                    <Label>Emoji</Label>
                    <Input placeholder="📊" className="w-20" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of your strategy..." className="min-h-[80px]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input type="color" defaultValue="#8b5cf6" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Trading Style</Label>
                    <Input placeholder="e.g. Day Trading, Swing, Scalping" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instrument Types</Label>
                  <Input placeholder="e.g. Stocks, Options, Futures, Crypto" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <Label className="text-sm font-medium">Track Missed Trades</Label>
                    <p className="text-xs text-muted-foreground">Log trades that matched your criteria but you didn't take</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">Rule Groups</Label>
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Group
                    </Button>
                  </div>
                  
                  {ruleGroups.map((group) => (
                    <div key={group.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-muted-foreground">::</div>
                          <span className="font-medium text-sm">{group.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full justify-center text-muted-foreground hover:text-foreground">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Rule
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button className="bg-[#00d4ff] hover:bg-[#00b8e0] text-black">Create Strategy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockStrategies.map((strategy) => (
            <Card 
              key={strategy.id} 
              className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => navigate(`/strategies/${strategy.id}`)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{strategy.emoji}</div>
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{strategy.name}</h3>
                      <p className="text-sm text-muted-foreground">{strategy.trades} trades</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEditStrategy(strategy.id);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStrategy(strategy.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        stroke="hsl(var(--primary))"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 30}`}
                        strokeDashoffset={`${2 * Math.PI * 30 * (1 - strategy.winRate / 100)}`}
                        className="transition-all"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{strategy.winRate}%</span>
                    </div>
                  </div>
                  <div className="flex-1 ml-6 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Win rate</span>
                      <span className="text-sm text-muted-foreground">Net P&L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">{strategy.winRate.toFixed(2)}%</span>
                      <span className={`text-sm font-semibold flex items-center gap-1 ${strategy.netPL >= 0 ? 'text-success' : 'text-destructive'}`}>
                        <TrendingUp className="h-3 w-3" />
                        ${strategy.netPL.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Profit Factor</p>
                    <p className="font-semibold">{strategy.profitFactor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Expectancy</p>
                    <p className="font-semibold">${strategy.expectancy.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Avg Winner</p>
                    <p className="font-semibold text-success">${strategy.avgWinner.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Avg Loser</p>
                    <p className="font-semibold text-destructive">${strategy.avgLoser.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        </div>
      </div>
      
      <ChatInput placeholder="Ask about your strategies or trading plans..." />
    </div>
  );
};
