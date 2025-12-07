import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ExternalLink, Globe, Newspaper, BarChart3, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface MarketSource {
  title: string;
  source: string;
  url: string;
  type: "news" | "analysis" | "data";
}

interface MarketAnalysisProps {
  analysis: {
    strategy: string;
    verdict: "favorable" | "neutral" | "unfavorable";
    confidence: number;
    marketCondition: string;
    summary: string;
    keyPoints: string[];
    sources: MarketSource[];
    timestamp: string;
  };
}

export const MarketAnalysisCard = ({ analysis }: MarketAnalysisProps) => {
  const verdictConfig = {
    favorable: {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: CheckCircle,
      label: "Favorable",
    },
    neutral: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      icon: AlertTriangle,
      label: "Neutral",
    },
    unfavorable: {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: TrendingDown,
      label: "Unfavorable",
    },
  };

  const sourceTypeIcon = {
    news: Newspaper,
    analysis: BarChart3,
    data: Globe,
  };

  const config = verdictConfig[analysis.verdict];
  const VerdictIcon = config.icon;

  return (
    <Card className={`p-4 sm:p-5 ${config.bg} ${config.border} border`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <VerdictIcon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base">Market Analysis</h3>
            <p className="text-xs text-muted-foreground">For: {analysis.strategy}</p>
          </div>
        </div>
        <Badge variant="outline" className={`${config.color} ${config.border} ${config.bg}`}>
          {config.label}
        </Badge>
      </div>

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Confidence Level</span>
          <span className={config.color}>{analysis.confidence}%</span>
        </div>
        <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              analysis.verdict === "favorable" ? "bg-emerald-500" :
              analysis.verdict === "neutral" ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${analysis.confidence}%` }}
          />
        </div>
      </div>

      {/* Market Condition */}
      <div className="flex items-center gap-2 mb-4 p-2.5 rounded-lg bg-background/50">
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-xs sm:text-sm">
          <span className="text-muted-foreground">Current Market: </span>
          <span className="font-medium">{analysis.marketCondition}</span>
        </span>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Key Points */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Points</h4>
        <ul className="space-y-1.5">
          {analysis.keyPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                analysis.verdict === "favorable" ? "bg-emerald-500" :
                analysis.verdict === "neutral" ? "bg-yellow-500" : "bg-red-500"
              }`} />
              <span className="text-foreground/80">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sources */}
      <div className="border-t border-border/50 pt-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Globe className="h-3 w-3" />
          Sources
        </h4>
        <div className="space-y-2">
          {analysis.sources.map((source, idx) => {
            const SourceIcon = sourceTypeIcon[source.type];
            return (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group"
              >
                <div className="p-1.5 rounded bg-muted/50">
                  <SourceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {source.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{source.source}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Analysis generated {analysis.timestamp}</span>
      </div>
    </Card>
  );
};
