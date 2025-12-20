import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Target,
  Lock 
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Modals
import { AddStrategyModal } from "@/components/strategies/AddStrategyModal";
import { EditStrategyModal } from "@/components/strategies/EditStrategyModal";

// Hooks & Context
import { useStrategies, StrategyOverview } from "@/hooks/use-strategies";
import { useAuth } from "@/contexts/AuthContext"; 
import { useModal } from "@/contexts/ModalContext"; 

export const Strategies = () => {
  const navigate = useNavigate();
  const { strategies, isLoading, deleteStrategy } = useStrategies();
  
  // 1. Get User Plan Info
  const { plan } = useAuth();
  const { openUpgradeModal } = useModal();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 2. Smart Limit Check Function
  const handleCreateClick = () => {
    const userPlan = plan.toUpperCase(); // "FREE", "PRO", "FOUNDER"
    const currentCount = strategies?.length || 0;

    // Logic: Free users get 1 strategy. Pro/Founder get unlimited (1000).
    const isProOrFounder = userPlan === "PRO" || userPlan === "FOUNDER";
    const limit = isProOrFounder ? 1000 : 1;

    if (currentCount >= limit) {
      openUpgradeModal(
        `You've reached the limit of ${limit} strategy on the ${userPlan} plan. Upgrade to create unlimited strategies.`
      );
      return;
    }

    // If quota is fine, open the modal
    setIsCreateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-[280px] rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6 lg:px-8">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Strategies</h1>
              <p className="text-muted-foreground">Define your edge, track your execution, and analyze what works.</p>
            </div>
            
            {/* 3. Protected Button */}
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleCreateClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Strategy
            </Button>
          </div>

          {/* Modals */}
          <AddStrategyModal 
            open={isCreateOpen} 
            onOpenChange={setIsCreateOpen} 
          />
          
          <EditStrategyModal 
            strategyId={editingId}
            open={!!editingId} 
            onOpenChange={(open) => !open && setEditingId(null)} 
          />

          {/* Strategy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies?.map((strategy: StrategyOverview) => {
              // Stats Logic
              const stats = strategy.stats || {
                totalTrades: 0, netPL: 0, winRate: 0, profitFactor: 0, avgWinner: 0, avgLoser: 0
              };
              const winRate = Number(stats.winRate) || 0;
              const avgWin = Number(stats.avgWinner) || 0;
              const avgLoss = Number(stats.avgLoser) || 0;
              const expectancy = ((winRate / 100) * avgWin) - ((1 - (winRate / 100)) * avgLoss);

              return (
                <Card 
                  key={strategy.id} 
                  className="bg-card border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md"
                  onClick={() => navigate(`/strategies/${strategy.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 text-2xl shadow-inner">
                          {strategy.emoji}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-none mb-1 group-hover:text-primary transition-colors">
                            {strategy.name}
                          </h3>
                          <Badge variant="outline" className="text-xs font-normal text-muted-foreground mt-1">
                            {stats.totalTrades} trades
                          </Badge>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { 
                            e.stopPropagation(); 
                            setEditingId(strategy.id); 
                          }}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              deleteStrategy(strategy.id); 
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Stats Visualization */}
                    <div className="flex items-center gap-6 mb-6">
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted/20" />
                          <circle cx="40" cy="40" r="32" 
                            stroke={strategy.color_hex || "#8b5cf6"} 
                            strokeWidth="6" 
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - winRate / 100)}`}
                            className="transition-all duration-1000 ease-out" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-sm font-bold">{winRate.toFixed(0)}%</span>
                          <span className="text-[10px] text-muted-foreground uppercase">Win</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Net P&L</p>
                        <div className={`text-2xl font-bold flex items-center gap-1 ${stats.netPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                           {stats.netPL >= 0 ? '+' : ''}${Math.abs(stats.netPL).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{strategy.style || "General"}</p>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-border pt-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Profit Factor</p>
                        {/* ✅ FIX: Removed the ternary check. Now shows 100.00 for no-loss strategies */}
                        <p className="text-sm font-medium">
                          {stats.profitFactor.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Expectancy</p>
                        <p className={`text-sm font-medium ${expectancy > 0 ? 'text-green-500' : 'text-red-500'}`}>${expectancy.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Avg Win</p>
                        <p className="text-sm font-medium text-green-500">+${avgWin.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-semibold">Avg Loss</p>
                        <p className="text-sm font-medium text-red-500">-${avgLoss.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {/* Empty State */}
          {!isLoading && strategies?.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-xl mt-6">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No strategies yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                Define your first strategy to start tracking your edge and performance metrics.
              </p>
              {/* Also protect the empty state button */}
              <Button onClick={handleCreateClick}>
                Create Strategy
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};