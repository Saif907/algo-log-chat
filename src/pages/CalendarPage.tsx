// frontend/src/pages/CalendarPage.tsx
import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatInput } from "@/components/ChatInput";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayHoverCard } from "@/components/calendar/DayHoverCard";
import { DayDetailModal } from "@/components/calendar/DayDetailModal";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendar } from "@/hooks/use-calendar"; 
import { Skeleton } from "@/components/ui/skeleton";

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("P&L Heat");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Fetch Real Data from the updated hook
  const { dailyStats, isLoading } = useCalendar(currentDate);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const daysOfWeekShort = ["S", "M", "T", "W", "T", "F", "S"];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDayOfWeek + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;
    return dayNumber;
  });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatMonthYearShort = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // ✅ UPDATE: Handle different view modes (P&L vs Win Rate)
  const getCellStyle = (day: number | null) => {
    if (!day || !dailyStats) return "";
    const data = dailyStats[day];
    if (!data || data.trades === 0) return "hover:bg-muted/50";
    
    if (viewMode === "Win Rate") {
        if (data.winRate >= 50) return "bg-success/20 border-success/30 hover:bg-success/30";
        return "bg-destructive/20 border-destructive/30 hover:bg-destructive/30";
    }

    // Default: P&L Heat
    if (data.pnl > 0) return "bg-success/20 border-success/30 hover:bg-success/30";
    if (data.pnl < 0) return "bg-destructive/20 border-destructive/30 hover:bg-destructive/30";
    return "hover:bg-muted/50";
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const handleDayClick = (day: number | null, isMobileView: boolean) => {
    if (day && dailyStats && dailyStats[day]) {
      setSelectedDay(day);
      if (isMobileView) {
        setMobileSheetOpen(true);
      } else {
        setModalOpen(true);
      }
    }
  };

  const getSelectedDayData = () => {
    if (!selectedDay || !dailyStats) return undefined;
    return dailyStats[selectedDay];
  };

  const getSelectedDate = () => {
    if (!selectedDay) return null;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
  };

  const selectedData = getSelectedDayData();

  // Helper for safe currency display
  const fmtMoney = (val: number) => `$${Math.abs(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen pb-24 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="py-4 sm:py-6 md:p-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Calendar</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Visualize your trading performance over time.</p>
        </div>

        {/* Controls - Mobile */}
        <div className="flex md:hidden flex-col gap-3 mb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-base font-semibold">
              {formatMonthYearShort(currentDate)}
            </span>
            <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Button variant="outline" size="sm" onClick={goToToday} className="flex-shrink-0">
              Today
            </Button>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[110px] h-8 text-xs flex-shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P&L Heat">P&L Heat</SelectItem>
                <SelectItem value="Win Rate">Win Rate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls - Desktop */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-9 w-9">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[180px] text-center">
              {formatMonthYear(currentDate)}
            </span>
            <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-9 w-9">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={goToToday}>Today</Button>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P&L Heat">P&L Heat</SelectItem>
                <SelectItem value="Win Rate">Win Rate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon"><Filter className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-7 gap-1 h-[600px]">
             {Array.from({length: 35}).map((_, i) => (
                 <Skeleton key={i} className="h-full w-full rounded-md" />
             ))}
          </div>
        )}

        {/* Calendar Grid - Desktop & Mobile */}
        {!isLoading && (
          <>
             {/* Mobile View */}
            <div className="md:hidden bg-card rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-7 border-b border-border">
                {daysOfWeekShort.map((day, i) => (
                  <div key={i} className="p-2 text-center text-xs font-medium text-muted-foreground">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const dayData = day && dailyStats ? dailyStats[day] : null;
                  const hasTrades = dayData && dayData.trades > 0;
                  return (
                    <div
                      key={index}
                      onClick={() => handleDayClick(day, true)}
                      className={`min-h-[48px] sm:min-h-[56px] border-r border-b border-border p-1 sm:p-1.5 relative transition-all duration-200 ${
                        day ? getCellStyle(day) : ""
                      } ${!day ? "bg-muted/30" : ""} ${
                        hasTrades ? "cursor-pointer active:scale-95" : ""
                      }`}
                    >
                      {day && (
                        <>
                          <div className="flex items-start justify-between">
                            <span className={`text-xs font-medium ${isToday(day) ? "bg-foreground text-background rounded-full w-5 h-5 flex items-center justify-center" : ""}`}>
                              {day}
                            </span>
                            {dayData && dayData.trades > 0 && (
                              <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center rounded-full text-[10px]">
                                {dayData.trades}
                              </Badge>
                            )}
                          </div>
                          {dayData && dayData.pnl !== 0 && (
                            <div className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${dayData.pnl > 0 ? "text-success" : "text-destructive"}`}>
                              {dayData.pnl > 0 ? "+" : ""}{Math.abs(dayData.pnl) >= 1000 ? `${(dayData.pnl / 1000).toFixed(1)}k` : dayData.pnl.toFixed(0)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

             {/* Desktop View */}
            <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-7 border-b border-border">
                {daysOfWeek.map((day) => (
                  <div key={day} className="p-4 text-center text-sm font-medium text-muted-foreground">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const dayData = day && dailyStats ? dailyStats[day] : null;
                  const hasTrades = dayData && dayData.trades > 0;

                  return (
                    <DayHoverCard
                      key={index}
                      day={day || 0}
                      // @ts-ignore - safe fallback
                      data={dayData || { trades: 0, pnl: 0, winRate: 0, emotion: "Neutral" }}
                    >
                      <div
                        onClick={() => handleDayClick(day, false)}
                        className={`min-h-[120px] border-r border-b border-border p-3 relative transition-all duration-200 ${
                          day ? getCellStyle(day) : ""
                        } ${!day ? "bg-muted/30" : ""} ${
                          hasTrades ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:z-10" : ""
                        }`}
                      >
                        {day && (
                          <>
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-sm font-medium">{day}</span>
                              {dayData && dayData.trades > 0 && (
                                <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs">
                                  {dayData.trades}
                                </Badge>
                              )}
                            </div>
                            {dayData && dayData.pnl !== 0 && (
                              <div className={`text-sm font-semibold ${dayData.pnl > 0 ? "text-success" : "text-destructive"}`}>
                                {dayData.pnl > 0 ? "+" : ""}{dayData.pnl.toFixed(2)}
                              </div>
                            )}
                            {isToday(day) && (
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                                <div className="h-2 w-2 rounded-full bg-foreground" />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </DayHoverCard>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 sm:w-8 bg-gradient-to-r from-destructive/40 to-destructive/60 rounded" />
            <span className="text-xs sm:text-sm text-muted-foreground">Loss / Low WR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 sm:w-8 bg-gradient-to-r from-success/40 to-success/60 rounded" />
            <span className="text-xs sm:text-sm text-muted-foreground">Profit / High WR</span>
          </div>
        </div>
      </div>

      {/* Desktop Modal */}
      <DayDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        date={getSelectedDate()}
        // @ts-ignore
        data={selectedData}
      />

      {/* Mobile Sheet (Fully Updated Content) */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-left">
              {getSelectedDate()?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </SheetTitle>
          </SheetHeader>
          
          {selectedData && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                <TabsTrigger value="trades" className="text-xs">Trades</TabsTrigger>
                <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Total P&L</p>
                    <p className={`text-lg font-bold ${selectedData.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                      {selectedData.pnl >= 0 ? "+" : "-"}{fmtMoney(selectedData.pnl)}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-bold">{selectedData.winRate}%</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Total R</p>
                    <p className="text-lg font-bold">{selectedData.totalR}R</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Emotion</p>
                    <p className="text-lg font-bold">{selectedData.emotion}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="trades" className="mt-4">
                <div className="space-y-2 h-[50vh] overflow-y-auto">
                  {selectedData.tradesList.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">{trade.symbol}</span>
                            {/* ✅ NEW: Mobile Instrument Badge */}
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{trade.instrument_type}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{trade.direction} • {trade.quantity} units</span>
                      </div>
                      <p className={`font-semibold ${trade.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                        {trade.pnl >= 0 ? "+" : "-"}{fmtMoney(trade.pnl)}
                      </p>
                    </div>
                  ))}
                  {selectedData.tradesList.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No trades on this day</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Best Strategy</p>
                    <p className="font-medium">{selectedData.bestStrategy || "N/A"}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">AI Insight</p>
                    <p className="text-sm">
                        {selectedData.pnl > 0 ? "Great execution day!" : "Review your risk management."} 
                        {selectedData.emotion !== "Neutral" && ` You traded with ${selectedData.emotion} emotion.`}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>

      <ChatInput placeholder="Ask about your trading calendar..." />
    </div>
  );
};