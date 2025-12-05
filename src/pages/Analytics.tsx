import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeAnalysis } from "@/components/analytics/TimeAnalysis";
import { TradeAnalysis } from "@/components/analytics/TradeAnalysis";
import { StrategyAnalysis } from "@/components/analytics/StrategyAnalysis";
import { PerformanceOverview } from "@/components/analytics/PerformanceOverview";
import { Clock, BarChart3, Target, TrendingUp } from "lucide-react";

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState("time");

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
              <TimeAnalysis />
            </TabsContent>
            <TabsContent value="trade" className="mt-0">
              <TradeAnalysis />
            </TabsContent>
            <TabsContent value="strategy" className="mt-0">
              <StrategyAnalysis />
            </TabsContent>
            <TabsContent value="overview" className="mt-0">
              <PerformanceOverview />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <ChatInput placeholder="Ask about your analytics or performance metrics..." />
    </div>
  );
};
