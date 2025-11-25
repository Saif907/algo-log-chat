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

// Mock data for demonstration
const mockTradeData = {
  18: { trades: 1, pnl: -700 },
  21: { trades: 1, pnl: 450 },
  22: { trades: 1, pnl: 0 },
  23: { trades: 1, pnl: 0 },
  24: { trades: 0, pnl: 0 }, // Today
};

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [viewMode, setViewMode] = useState("P&L Heat");

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

  return (
    <div className="min-h-screen pb-24">
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
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] border-r border-b border-border p-3 relative ${
                  day ? getCellStyle(day) : ""
                } ${!day ? "bg-muted/30" : ""}`}
              >
                {day && (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium">{day}</span>
                      {mockTradeData[day as keyof typeof mockTradeData]?.trades > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
                        >
                          {mockTradeData[day as keyof typeof mockTradeData]?.trades}
                        </Badge>
                      )}
                    </div>
                    {mockTradeData[day as keyof typeof mockTradeData] && 
                     mockTradeData[day as keyof typeof mockTradeData].pnl !== 0 && (
                      <div
                        className={`text-sm font-semibold ${
                          mockTradeData[day as keyof typeof mockTradeData].pnl > 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        ${mockTradeData[day as keyof typeof mockTradeData].pnl > 0 ? "+" : ""}
                        {mockTradeData[day as keyof typeof mockTradeData].pnl.toFixed(2)}
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
            ))}
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

      <ChatInput placeholder="Ask about your trading calendar..." />
    </div>
  );
};
