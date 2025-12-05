import { BookOpen, TrendingUp, Target, BarChart3, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StrategyCardProps {
  strategy: {
    name: string;
    description?: string;
    marketCondition?: string;
    entryRules?: string[];
    exitRules?: string[];
    riskManagement?: string;
    winRate?: number;
    avgRMultiple?: number;
  };
}

export const StrategyCard = ({ strategy }: StrategyCardProps) => {
  return (
    <Card className="p-4 border-l-4 border-l-primary bg-primary/5">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-lg">{strategy.name}</span>
          </div>
          <Badge variant="outline" className="text-xs">Strategy</Badge>
        </div>

        {/* Description */}
        {strategy.description && (
          <p className="text-sm text-muted-foreground">{strategy.description}</p>
        )}

        {/* Rules */}
        {strategy.entryRules && strategy.entryRules.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" /> Entry Rules
            </p>
            <ul className="text-sm space-y-1">
              {strategy.entryRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {strategy.exitRules && strategy.exitRules.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Exit Rules
            </p>
            <ul className="text-sm space-y-1">
              {strategy.exitRules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats */}
        {(strategy.winRate || strategy.avgRMultiple) && (
          <div className="flex items-center gap-4 pt-2 border-t border-border/50">
            {strategy.winRate && (
              <div className="flex items-center gap-1 text-sm">
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="font-medium text-green-500">{strategy.winRate}%</span>
              </div>
            )}
            {strategy.avgRMultiple && (
              <div className="flex items-center gap-1 text-sm">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Avg R:</span>
                <span className="font-medium">{strategy.avgRMultiple}R</span>
              </div>
            )}
          </div>
        )}

        {/* Market Condition */}
        {strategy.marketCondition && (
          <Badge variant="secondary" className="text-xs">
            {strategy.marketCondition}
          </Badge>
        )}
      </div>
    </Card>
  );
};
