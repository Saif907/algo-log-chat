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
import { DayHoverCard } from "@/components/calendar/DayHoverCard";
import { DayDetailModal } from "@/components/calendar/DayDetailModal";

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

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
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

  const handleDayClick = (day: number | null) => {
    if (day && mockTradeData[day]) {
      setSelectedDay(day);
      setModalOpen(true);
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

  return (
    <div className="min-h-screen pb-24 px-4 md:px-6 lg:px-8">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">Visualize your trading performance over time.</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
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

        {/* Calendar Grid */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
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
                    onClick={() => handleDayClick(day)}
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
        <div className="flex items-center justify-end gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 bg-gradient-to-r from-destructive/40 to-destructive/60 rounded" />
            <span className="text-sm text-muted-foreground">Loss</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 bg-gradient-to-r from-success/40 to-success/60 rounded" />
            <span className="text-sm text-muted-foreground">Profit</span>
          </div>
        </div>
      </div>

      <DayDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        date={getSelectedDate()}
        data={getSelectedDayData()}
      />

      <ChatInput placeholder="Ask about your trading calendar..." />
    </div>
  );
};
