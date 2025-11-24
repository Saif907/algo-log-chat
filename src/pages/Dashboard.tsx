import { Filter, Calendar as CalendarIcon, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChatInput } from "@/components/ChatInput";

const radarData = [
  { subject: 'Win Rate', value: 75 },
  { subject: 'Profit Factor', value: 64 },
  { subject: 'Consistency', value: 55 },
  { subject: 'Discipline', value: 68 },
];

const cumulativeData = [
  { date: 'Nov 18', value: 0 },
  { date: 'Nov 19', value: -200 },
  { date: 'Nov 20', value: -250 },
  { date: 'Nov 21', value: -250 },
];

const dailyData = [
  { date: '19', value: -700 },
  { date: '21', value: 450 },
];

export const Dashboard = () => {
  return (
    <div className="min-h-screen pb-24">
      <div className="p-6 space-y-6">
      {/* Filters Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          Pick a date range
        </Button>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Instrument" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Instrument</SelectItem>
            <SelectItem value="forex">Forex</SelectItem>
            <SelectItem value="stocks">Stocks</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Direction</SelectItem>
            <SelectItem value="long">Long</SelectItem>
            <SelectItem value="short">Short</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" className="ml-auto gap-2">
          <X className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net P&L Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Net P&L
              <HelpCircle className="h-3 w-3" />
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
              <span className="text-destructive text-sm font-semibold">$</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">$-250.00</div>
            <p className="text-xs text-muted-foreground mt-1">↓ 2 trades</p>
          </CardContent>
        </Card>

        {/* Trade Win % Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Trade Win %
              <HelpCircle className="h-3 w-3" />
            </CardTitle>
            <Badge variant="secondary" className="rounded-full">1W</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">50.0%</div>
            <div className="mt-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Factor Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Profit Factor
              <HelpCircle className="h-3 w-3" />
            </CardTitle>
            <Badge variant="destructive" className="rounded-full">0.6</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.64</div>
            <div className="mt-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-destructive rounded-full" style={{ width: '64%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day Win % Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Day Win %
              <HelpCircle className="h-3 w-3" />
            </CardTitle>
            <Badge variant="secondary" className="rounded-full">1D</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">50.0%</div>
            <div className="mt-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avg Win/Loss Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Avg Win / Loss
            <HelpCircle className="h-3 w-3" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Avg Win</span>
              <span className="text-sm font-semibold text-success">$450</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: '45%' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Avg Loss</span>
              <span className="text-sm font-semibold text-destructive">$700</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-destructive rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trader Edge Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              Trader Edge Score
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <div className="text-4xl font-bold">36</div>
            </div>
          </CardContent>
        </Card>

        {/* Net Cumulative P&L */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Net Cumulative P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--muted-foreground))" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Net Daily P&L */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Net Daily P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      </div>
      
      <ChatInput placeholder="Ask about your trading performance..." />
    </div>
  );
};
