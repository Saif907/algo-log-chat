import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Trash2, Edit, TrendingUp, Loader2, X } from "lucide-react";
import { useStrategies } from "@/hooks/use-strategies";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ 1. Import Context and Error Type
import { useModal } from "@/contexts/ModalContext";
import { ApiError } from "@/services/api";

export const Strategies = () => {
  const navigate = useNavigate();
  const { strategies, isLoading, createStrategy, deleteStrategy } = useStrategies();
  
  // ✅ 2. Hook into the Modal Context
  const { openUpgradeModal } = useModal();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dynamic Rule State
  const [ruleGroups, setRuleGroups] = useState([
    { id: "market", name: "Market State / Conditions", rules: [] as string[] },
    { id: "entry", name: "Entry Rules", rules: [] as string[] },
    { id: "exit", name: "Exit / Target Rules", rules: [] as string[] },
    { id: "risk", name: "Risk / Management Rules", rules: [] as string[] },
  ]);

  // --- Group Management ---
  const addGroup = () => {
    const newId = `group-${Date.now()}`;
    setRuleGroups([...ruleGroups, { id: newId, name: "New Rule Group", rules: [] }]);
  };

  const deleteGroup = (groupId: string) => {
    setRuleGroups(ruleGroups.filter(g => g.id !== groupId));
  };

  const updateGroupName = (groupId: string, newName: string) => {
    setRuleGroups(ruleGroups.map(g => g.id === groupId ? { ...g, name: newName } : g));
  };

  // --- Rule Management ---
  const addRule = (groupId: string, rule: string) => {
    if (!rule.trim()) return;
    setRuleGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, rules: [...g.rules, rule] } : g
    ));
  };

  const updateRule = (groupId: string, index: number, newText: string) => {
    setRuleGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, rules: g.rules.map((r, i) => i === index ? newText : r) } : g
    ));
  };

  const removeRule = (groupId: string, index: number) => {
    setRuleGroups(prev => prev.map(g => 
      g.id === groupId ? { ...g, rules: g.rules.filter((_, i) => i !== index) } : g
    ));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const rulesJson: Record<string, string[]> = {};
      ruleGroups.forEach(g => {
        if (g.rules.length > 0) {
          rulesJson[g.name] = g.rules;
        }
      });

      await createStrategy({
        name: formData.get("name") as string,
        emoji: (formData.get("emoji") as string) || "📈",
        description: formData.get("description") as string,
        color_hex: (formData.get("color") as string) || "#8b5cf6",
        style: formData.get("style") as string,
        instrument_types: formData.get("instruments")?.toString().split(",").map(s => s.trim()) || [],
        track_missed_trades: true,
        rules: rulesJson
      });
      
      setIsCreateOpen(false);
      // Reset form state
      setRuleGroups([
        { id: "market", name: "Market State / Conditions", rules: [] },
        { id: "entry", name: "Entry Rules", rules: [] },
        { id: "exit", name: "Exit / Target Rules", rules: [] },
        { id: "risk", name: "Risk / Management Rules", rules: [] },
      ]);
    } catch (error: any) {
      // ✅ 3. INTERCEPT QUOTA ERROR
      console.error("Strategy creation failed:", error);
      
      // Check if it's the specific "Payment Required" error from QuotaManager
      if (error?.status === 402 || (error instanceof ApiError && error.status === 402)) {
        setIsCreateOpen(false); // Close the form dialog
        openUpgradeModal("You've reached the strategy limit for the Free plan. Upgrade to create unlimited strategies.");
      } else {
        // You can add a toast notification here for generic errors if you like
        // toast.error("Failed to create strategy. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Comprehensive Stats Calculation
  const getStrategyStats = (strategy: any) => {
    const trades = strategy.trades || [];
    const totalTrades = trades.length;
    
    if (totalTrades === 0) {
      return { 
        winRate: 0, netPL: 0, profitFactor: 0, 
        expectancy: 0, avgWinner: 0, avgLoser: 0 
      };
    }

    const winners = trades.filter((t: any) => (t.pnl || 0) > 0);
    const losers = trades.filter((t: any) => (t.pnl || 0) <= 0);
    
    const grossProfit = winners.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0);
    const grossLoss = Math.abs(losers.reduce((sum: number, t: any) => sum + (t.pnl || 0), 0));
    const netPL = grossProfit - grossLoss;

    const winRate = (winners.length / totalTrades) * 100;
    const avgWinner = winners.length > 0 ? grossProfit / winners.length : 0;
    const avgLoser = losers.length > 0 ? grossLoss / losers.length : 0;
    
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 999 : 0);
    
    // Expectancy = (Win % * Avg Win) - (Loss % * Avg Loss)
    // Note: Avg Loser here is absolute value
    const expectancy = ((winRate/100) * avgWinner) - ((1 - (winRate/100)) * avgLoser);

    return { winRate, netPL, profitFactor, expectancy, avgWinner, avgLoser };
  };

  if (isLoading) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    );
  }

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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Strategy</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleCreateSubmit} className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Strategy Name *</Label>
                    <Input name="name" placeholder="e.g. Morning Breakout" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Emoji</Label>
                    <Input name="emoji" placeholder="🚀" className="w-20" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" placeholder="Brief description..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input name="color" type="color" defaultValue="#8b5cf6" className="h-10 cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Style</Label>
                    <Input name="style" placeholder="e.g. Day Trading" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Instrument Types (comma separated)</Label>
                  <Input name="instruments" placeholder="Stocks, Options" />
                </div>

                <div className="space-y-4 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Strategy Rules & Groups</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addGroup}>
                      <Plus className="h-3 w-3 mr-1" /> Add Group
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {ruleGroups.map((group) => (
                      <div key={group.id} className="border rounded-lg p-4 space-y-3 bg-card/50 shadow-sm">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex-1">
                             <Input 
                               value={group.name}
                               onChange={(e) => updateGroupName(group.id, e.target.value)}
                               className="font-semibold h-8 border-transparent hover:border-input focus:border-input px-2 -ml-2"
                             />
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                            onClick={() => deleteGroup(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 pl-2">
                          {group.rules.map((rule, idx) => (
                            <div key={idx} className="flex items-center gap-2 group/rule">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-0.5 flex-shrink-0" />
                              <Input 
                                value={rule}
                                onChange={(e) => updateRule(group.id, idx, e.target.value)}
                                className="h-8 text-sm border-transparent hover:border-input focus:border-input"
                              />
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-0 group-hover/rule:opacity-100 text-muted-foreground hover:text-destructive"
                                onClick={() => removeRule(group.id, idx)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="flex items-center gap-2 mt-2">
                             <Plus className="h-3 w-3 text-muted-foreground ml-1" />
                             <Input 
                               placeholder={`Add new rule to ${group.name}...`}
                               className="h-8 text-sm bg-muted/30 border-transparent focus:bg-background"
                               onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                   e.preventDefault();
                                   addRule(group.id, e.currentTarget.value);
                                   e.currentTarget.value = '';
                                 }
                               }}
                             />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Strategy
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies?.map((strategy) => {
            const stats = getStrategyStats(strategy);
            const tradeCount = strategy.trades?.length || 0;

            return (
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
                        <p className="text-sm text-muted-foreground">{tradeCount} trades</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/strategies/${strategy.id}`); }}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); deleteStrategy(strategy.id); }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted/20" />
                        <circle cx="40" cy="40" r="30" stroke={strategy.color_hex || "currentColor"} strokeWidth="6" fill="none"
                          strokeDasharray={`${2 * Math.PI * 30}`}
                          strokeDashoffset={`${2 * Math.PI * 30 * (1 - stats.winRate / 100)}`}
                          className="transition-all" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{stats.winRate.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="flex-1 ml-6 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Win rate</span>
                        <span className="text-sm text-muted-foreground">Net P&L</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">{stats.winRate.toFixed(2)}%</span>
                        <span className={`text-sm font-semibold flex items-center gap-1 ${stats.netPL >= 0 ? 'text-success' : 'text-destructive'}`}>
                          <TrendingUp className="h-3 w-3" />
                          ${stats.netPL.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm border-t border-border/50 pt-4 mt-2">
                    <div>
                      <p className="text-muted-foreground text-xs">Profit Factor</p>
                      <p className="font-semibold">{stats.profitFactor.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Expectancy</p>
                      <p className="font-semibold">${stats.expectancy.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Avg Winner</p>
                      <p className="font-semibold text-success">${stats.avgWinner.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Avg Loser</p>
                      <p className="font-semibold text-destructive">-${stats.avgLoser.toFixed(2)}</p>
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
};