import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Filter, Search, Copy, Heart, Calendar, Clock } from "lucide-react";

const mockTrades = [
  {
    id: 1,
    symbol: "TSLA",
    direction: "Long",
    instrument: "Stock",
    account: "TD Ameritrade",
    entry: { date: "Nov 22, 2025", time: "09:32", price: 245.5 },
    exit: { date: "Nov 22, 2025", time: "12:05", price: 252.3 },
    holdingTime: "2h 35m",
    pl: 680.00,
    rMultiple: 2.8,
    returnPct: 2.77,
    playbook: "ORB Breakout",
    mistakes: 2,
    notes: 3,
  },
  {
    id: 2,
    symbol: "NVDA",
    direction: "Long",
    instrument: "Stock",
    account: "TD Ameritrade",
    entry: { date: "Nov 21, 2025", time: "10:15", price: 485.2 },
    exit: { date: "Nov 21, 2025", time: "14:30", price: 488.9 },
    holdingTime: "4h 15m",
    pl: 185.00,
    rMultiple: 1.2,
    returnPct: 0.76,
    playbook: "Pullback Entry",
    mistakes: 1,
    notes: 2,
  },
  {
    id: 3,
    symbol: "BANKNIFTY",
    direction: "Long",
    instrument: "Options",
    account: "Zerodha",
    entry: { date: "Nov 21, 2025", time: "09:18", price: 145.5 },
    exit: { date: "Nov 21, 2025", time: "10:45", price: 138.2 },
    holdingTime: "1h 27m",
    pl: -1460.00,
    rMultiple: -1.5,
    returnPct: -5.02,
    playbook: "No playbook",
    mistakes: 4,
    notes: 2,
  },
];

export const Trades = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trades</h1>
            <p className="text-muted-foreground">Manage and analyze your trading history</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#00d4ff] hover:bg-[#00b8e0] text-black">
              <Plus className="h-4 w-4 mr-2" />
              Add Trade
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="p-4 bg-card border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
            <p className="text-2xl font-bold">5</p>
          </Card>
          <Card className="p-4 bg-card border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-success">80.0%</p>
          </Card>
          <Card className="p-4 bg-card border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Winning</p>
            <p className="text-2xl font-bold text-success">4</p>
          </Card>
          <Card className="p-4 bg-card border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Losing</p>
            <p className="text-2xl font-bold text-destructive">1</p>
          </Card>
          <Card className="p-4 bg-card border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total P/L</p>
            <p className="text-2xl font-bold text-success">+$242.50</p>
          </Card>
          <Card className="p-4 bg-card border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Avg R</p>
            <p className="text-2xl font-bold text-[#00d4ff]">1.50R</p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Trades</TabsTrigger>
            <TabsTrigger value="winning">Winning</TabsTrigger>
            <TabsTrigger value="losing">Losing</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="p-6 mb-6 bg-card border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search symbol..." className="pl-9" />
            </div>
            <Select defaultValue="all-accounts">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-accounts">All Accounts</SelectItem>
                <SelectItem value="td">TD Ameritrade</SelectItem>
                <SelectItem value="zerodha">Zerodha</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-instruments">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-instruments">All Instruments</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="options">Options</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-directions">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-directions">All Directions</SelectItem>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="short">Short</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-playbooks">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-playbooks">All Playbooks</SelectItem>
                <SelectItem value="orb">ORB Breakout</SelectItem>
                <SelectItem value="pullback">Pullback Entry</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="open">Open</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="bg-card border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Symbol</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Instrument</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>Holding Time</TableHead>
                <TableHead>P/L</TableHead>
                <TableHead>R-Multiple</TableHead>
                <TableHead>Return %</TableHead>
                <TableHead>Playbook</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTrades.map((trade) => (
                <TableRow key={trade.id} className="border-border/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{trade.symbol}</span>
                      <Copy className="h-3 w-3 text-muted-foreground cursor-pointer" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#00d4ff]/20 text-[#00d4ff] hover:bg-[#00d4ff]/30 border-[#00d4ff]/50">
                      {trade.direction}
                    </Badge>
                  </TableCell>
                  <TableCell>{trade.instrument}</TableCell>
                  <TableCell className="text-muted-foreground">{trade.account}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {trade.entry.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {trade.entry.time} @ ${trade.entry.price}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {trade.exit.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {trade.exit.time} @ ${trade.exit.price}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{trade.holdingTime}</TableCell>
                  <TableCell className={trade.pl > 0 ? "text-success" : "text-destructive"}>
                    {trade.pl > 0 ? "+" : ""}${trade.pl.toFixed(2)}
                  </TableCell>
                  <TableCell className={trade.rMultiple > 0 ? "text-success" : "text-destructive"}>
                    {trade.rMultiple > 0 ? "+" : ""}{trade.rMultiple.toFixed(1)}R
                  </TableCell>
                  <TableCell className={trade.returnPct > 0 ? "text-success" : "text-destructive"}>
                    {trade.returnPct > 0 ? "+" : ""}{trade.returnPct.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {trade.playbook !== "No playbook" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      <span className={trade.playbook === "No playbook" ? "text-muted-foreground" : ""}>
                        {trade.playbook}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <span className="text-[#00d4ff]">⚡</span> Plan
                      </Badge>
                      <Badge variant="destructive" className="text-xs">
                        {trade.mistakes} mistakes
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Heart className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-muted-foreground">{trade.notes}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
