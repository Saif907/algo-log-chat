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
import { Badge } from "@/components/ui/badge";
import { DayHoverCard } from "@/components/calendar/DayHoverCard";
import { DayDetailModal } from "@/components/calendar/DayDetailModal";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const mockTradeData: Record<number, any> = {
  18: { 
    trades: 1, 
    pnl: -700,
    winRate: 0,
    bestStrategy: "Breakout",
    totalR: -2.5,
    emotion: "Frustrated",
    playbooks: [{ name: "Breakout", count: 1 }],
    bestTrade: { symbol: "AAPL", pnl: 0 },
    worstTrade: { symbol: "AAPL", pnl: -700 },
    tradesList: [
      { id: "1", symbol: "AAPL", direction: "Long", entry: 150, exit: 143, pnl: -700 }
    ]
  },
  21: { 
    trades: 1, 
    pnl: 450,
    winRate: 100,
    bestStrategy: "Momentum",
    totalR: 1.5,
    emotion: "Confident",
    playbooks: [{ name: "Momentum", count: 1 }],
    bestTrade: { symbol: "TSLA", pnl: 450 },
    worstTrade: { symbol: "TSLA", pnl: 450 },
    tradesList: [
      { id: "2", symbol: "TSLA", direction: "Long", entry: 200, exit: 215, pnl: 450 }
    ]
  },
  22: { 
    trades: 1, 
    pnl: 0,
    winRate: 0,
    bestStrategy: "Range",
    totalR: 0,
    emotion: "Neutral",
    playbooks: [{ name: "Range", count: 1 }],
    bestTrade: { symbol: "MSFT", pnl: 0 },
    worstTrade: { symbol: "MSFT", pnl: 0 },
    tradesList: [
      { id: "3", symbol: "MSFT", direction: "Short", entry: 300, exit: 300, pnl: 0 }
    ]
  },
  23: { 
    trades: 1, 
    pnl: 0,
    winRate: 0,
    bestStrategy: "Scalp",
    totalR: 0,
    emotion: "Calm",
    playbooks: [{ name: "Scalp", count: 1 }],
    bestTrade: { symbol: "GOOGL", pnl: 0 },
    worstTrade: { symbol: "GOOGL", pnl: 0 },
    tradesList: [
      { id: "4", symbol: "GOOGL", direction: "Long", entry: 140, exit: 140, pnl: 0 }
    ]
  },
  24: { 
    trades: 0, 
    pnl: 0,
    winRate: 0,
    totalR: 0,
    emotion: "N/A",
    playbooks: [],
    bestTrade: { symbol: "-", pnl: 0 },
    worstTrade: { symbol: "-", pnl: 0 },
    tradesList: []
  },
};

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [viewMode, setViewMode] = useState("P&L Heat");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

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

  const getCellStyle = (day: number | null) => {
    if (!day) return "";
    const data = mockTradeData[day as keyof typeof mockTradeData];
    if (!data) return "";
    
    if (data.pnl > 0) return "bg-success/20 border-success/30";
    if (data.pnl < 0) return "bg-destructive/20 border-destructive/30";
    return "";
  };

  const isToday = (day: number | null) => {
    return day === 24;
  };

  const handleDayClick = (day: number | null, isMobileView: boolean) => {
    if (day && mockTradeData[day]) {
      setSelectedDay(day);
      if (isMobileView) {
        setMobileSheetOpen(true);
      } else {
        setModalOpen(true);
      }
    }
  };

  const getSelectedDayData = () => {
    if (!selectedDay) return null;
    return mockTradeData[selectedDay];
  };

  const getSelectedDate = () => {
    if (!selectedDay) return null;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
  };

  const selectedData = getSelectedDayData();

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
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-base font-semibold">
              {formatMonthYearShort(currentDate)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
              className="h-8 w-8"
            >
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
                <SelectItem value="Volume">Volume</SelectItem>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[180px] text-center">
              {formatMonthYear(currentDate)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="P&L Heat">P&L Heat</SelectItem>
                <SelectItem value="Win Rate">Win Rate</SelectItem>
                <SelectItem value="Volume">Volume</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid - Mobile */}
        <div className="md:hidden bg-card rounded-lg border border-border overflow-hidden">
          {/* Day headers - Mobile */}
          <div className="grid grid-cols-7 border-b border-border">
            {daysOfWeekShort.map((day, i) => (
              <div
                key={i}
                className="p-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days - Mobile */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayData = day ? mockTradeData[day] : null;
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
                        {dayData?.trades > 0 && (
                          <Badge
                            variant="secondary"
                            className="h-4 w-4 p-0 flex items-center justify-center rounded-full text-[10px]"
                          >
                            {dayData.trades}
                          </Badge>
                        )}
                      </div>
                      {dayData && dayData.pnl !== 0 && (
                        <div
                          className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${
                            dayData.pnl > 0 ? "text-success" : "text-destructive"
                          }`}
                        >
                          ${dayData.pnl > 0 ? "+" : ""}
                          {Math.abs(dayData.pnl) >= 1000 
                            ? `${(dayData.pnl / 1000).toFixed(1)}k` 
                            : dayData.pnl}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Grid - Desktop */}
        <div className="hidden md:block bg-card rounded-lg border border-border overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="p-4 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayData = day ? mockTradeData[day] : null;
              const hasTrades = dayData && dayData.trades > 0;

              return (
                <DayHoverCard
                  key={index}
                  day={day || 0}
                  data={dayData || { trades: 0, pnl: 0 }}
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
                          {dayData?.trades > 0 && (
                            <Badge
                              variant="secondary"
                              className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
                            >
                              {dayData.trades}
                            </Badge>
                          )}
                        </div>
                        {dayData && dayData.pnl !== 0 && (
                          <div
                            className={`text-sm font-semibold ${
                              dayData.pnl > 0 ? "text-success" : "text-destructive"
                            }`}
                          >
                            ${dayData.pnl > 0 ? "+" : ""}
                            {dayData.pnl.toFixed(2)}
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

        {/* Legend */}
        <div className="flex items-center justify-center sm:justify-end gap-4 sm:gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 sm:w-8 bg-gradient-to-r from-destructive/40 to-destructive/60 rounded" />
            <span className="text-xs sm:text-sm text-muted-foreground">Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 sm:w-8 bg-gradient-to-r from-success/40 to-success/60 rounded" />
            <span className="text-xs sm:text-sm text-muted-foreground">Profit</span>
          </div>
        </div>
      </div>

      {/* Desktop Modal */}
      <DayDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        date={getSelectedDate()}
        data={getSelectedDayData()}
      />

      {/* Mobile Sheet */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-left">
              {getSelectedDate()?.toLocaleDateString("en-US", { 
                weekday: "long", 
                month: "long", 
                day: "numeric" 
              })}
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
                      ${selectedData.pnl >= 0 ? "+" : ""}{selectedData.pnl}
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
                <div className="space-y-2">
                  {selectedData.tradesList.map((trade: any) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{trade.symbol}</p>
                        <p className="text-xs text-muted-foreground">{trade.direction}</p>
                      </div>
                      <p className={`font-semibold ${trade.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                        ${trade.pnl >= 0 ? "+" : ""}{trade.pnl}
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
                    <p className="text-sm">Your emotional state was {selectedData.emotion?.toLowerCase()}. Consider reviewing your risk management for similar market conditions.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
