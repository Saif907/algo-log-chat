// frontend/src/pages/settings/AccountsBrokers.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, RefreshCw, Trash2, Plus, Loader2, ShieldCheck, AlertCircle 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { api, BrokerAccount } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function AccountsBrokers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // Form State
  const [newBroker, setNewBroker] = useState({
    broker_name: "",
    api_key: "",
    api_secret: ""
  });

  // --- Queries & Mutations ---

  const { data: brokers = [], isLoading } = useQuery({
    queryKey: ['brokers'],
    queryFn: api.brokers.getAll,
  });

  const addBrokerMutation = useMutation({
    mutationFn: async () => {
      if (!newBroker.broker_name || !newBroker.api_key || !newBroker.api_secret) {
        throw new Error("All fields are required");
      }
      return api.brokers.add(newBroker);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brokers'] });
      toast({ title: "Connected", description: `${newBroker.broker_name} added successfully.` });
      setIsAddOpen(false);
      setNewBroker({ broker_name: "", api_key: "", api_secret: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Connection Failed", description: err.message, variant: "destructive" });
    }
  });

  const deleteBrokerMutation = useMutation({
    mutationFn: api.brokers.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brokers'] });
      toast({ title: "Removed", description: "Broker account disconnected." });
    }
  });

  const syncBrokerMutation = useMutation({
    mutationFn: api.brokers.sync,
    onSuccess: () => {
      toast({ title: "Sync Started", description: "Fetching latest trades..." });
    }
  });

  return (
    <SettingsLayout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Accounts & Brokers</h1>
            <p className="text-muted-foreground mt-1">
              Connect your exchange accounts to auto-import trades.
            </p>
          </div>
        </div>

        {/* Connected Brokers List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Connected Integrations
              </h2>
              
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Connect Broker
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect New Broker</DialogTitle>
                    <DialogDescription>
                      API Keys are encrypted using AES-256 before storage.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Exchange / Broker</Label>
                      <Select 
                        value={newBroker.broker_name} 
                        onValueChange={(val) => setNewBroker({...newBroker, broker_name: val})}
                      >
                        <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectGroup>
                            <SelectLabel>Indian Markets (NSE/BSE)</SelectLabel>
                            <SelectItem value="Zerodha">Zerodha (Kite)</SelectItem>
                            <SelectItem value="Upstox">Upstox</SelectItem>
                            <SelectItem value="Angel One">Angel One</SelectItem>
                            <SelectItem value="Dhan">Dhan</SelectItem>
                            <SelectItem value="Fyers">Fyers</SelectItem>
                            <SelectItem value="Groww">Groww</SelectItem>
                          </SelectGroup>
                          
                          <SelectGroup>
                            <SelectLabel>Crypto Exchanges</SelectLabel>
                            <SelectItem value="Binance">Binance</SelectItem>
                            <SelectItem value="Coinbase">Coinbase</SelectItem>
                            <SelectItem value="Kraken">Kraken</SelectItem>
                            <SelectItem value="Bybit">Bybit</SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel>Global / Forex</SelectLabel>
                            <SelectItem value="Interactive Brokers">Interactive Brokers</SelectItem>
                            <SelectItem value="Alpaca">Alpaca</SelectItem>
                            <SelectItem value="MetaTrader 4">MetaTrader 4</SelectItem>
                            <SelectItem value="MetaTrader 5">MetaTrader 5</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>API Key / Client ID</Label>
                      <Input 
                        type="password"
                        placeholder="Paste your API Key or Client ID"
                        value={newBroker.api_key}
                        onChange={(e) => setNewBroker({...newBroker, api_key: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>API Secret / Access Token</Label>
                      <Input 
                        type="password"
                        placeholder="Paste your API Secret"
                        value={newBroker.api_secret}
                        onChange={(e) => setNewBroker({...newBroker, api_secret: e.target.value})}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button onClick={() => addBrokerMutation.mutate()} disabled={addBrokerMutation.isPending}>
                      {addBrokerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Connect Securely
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading accounts...
              </div>
            ) : brokers.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg">No accounts connected</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                  Link your brokerage account to automatically sync trades, PnL, and positions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {brokers.map((broker) => (
                  <div
                    key={broker.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{broker.broker_name}</h3>
                          <Badge
                            variant={broker.is_active ? "default" : "secondary"}
                            className="text-[10px] h-5"
                          >
                            {broker.is_active ? "Active" : "Paused"}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 rounded">
                            ..{broker.api_key_last_digits}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          Last sync: {broker.last_sync_time 
                            ? formatDistanceToNow(new Date(broker.last_sync_time), { addSuffix: true }) 
                            : "Never"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 self-end sm:self-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => syncBrokerMutation.mutate(broker.id)}
                        disabled={syncBrokerMutation.isPending}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${syncBrokerMutation.isPending ? 'animate-spin' : ''}`} />
                        Sync
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteBrokerMutation.mutate(broker.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3 items-start">
           <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
           <div className="text-sm">
              <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">Security Note</h4>
              <p className="text-muted-foreground mt-1">
                 Your API Secret is <strong>never</strong> stored in plain text. It is encrypted immediately upon receipt using AES-256 and can only be decrypted by the sync engine.
              </p>
           </div>
        </div>
      </div>
    </SettingsLayout>
  );
}