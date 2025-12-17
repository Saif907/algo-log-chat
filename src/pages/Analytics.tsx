import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeAnalysis } from "@/components/analytics/TimeAnalysis";
import { TradeAnalysis } from "@/components/analytics/TradeAnalysis";
import { StrategyAnalysis } from "@/components/analytics/StrategyAnalysis";
import { PerformanceOverview } from "@/components/analytics/PerformanceOverview";
import { Clock, BarChart3, Target, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { Skeleton } from "@/components/ui/skeleton";

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState("time");
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <div className="min-h-screen p-6 space-y-6 pb-28 sm:pb-32">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-border">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 sm:pb-32">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-border">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Analytics</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Deep dive into your trading performance
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto p-1 grid grid-cols-2 sm:grid-cols-4 gap-1 bg-muted/50">
            <TabsTrigger 
              value="time" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Time</span> Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="trade" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Trade</span> Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="strategy" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Strategy</span> Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm py-2 sm:py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Performance</span> Overview
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 sm:mt-6">
            <TabsContent value="time" className="mt-0">
              <TimeAnalysis 
                rawTrades={data.rawTrades} 
                hourlyHeatmap={data.hourlyHeatmap}
              />
            </TabsContent>
            
            <TabsContent value="trade" className="mt-0">
              <TradeAnalysis 
                rawTrades={data.rawTrades}
                mistakeData={data.mistakeData}
                emotionData={data.emotionData}
                tagData={data.tagData}
                rMultipleData={data.rMultipleData}
              />
            </TabsContent>
            
            <TabsContent value="strategy" className="mt-0">
              <StrategyAnalysis 
                strategies={data.strategyLeaderboard} 
                monthlyPerf={data.monthlyStrategyPerf}
              />
            </TabsContent>
            
            <TabsContent value="overview" className="mt-0">
              <PerformanceOverview 
                equityData={data.equityData} 
                highlights={data.performanceHighlights} 
                stats={data.globalStats}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      
    </div>
  );
};