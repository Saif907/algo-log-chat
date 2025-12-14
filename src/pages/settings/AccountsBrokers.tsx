// frontend/src/pages/settings/AccountsBrokers.tsx
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, RefreshCw, Trash2, Plus, Loader2, ShieldCheck, ExternalLink 
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [processingDhan, setProcessingDhan] = useState(false);

  const [newBroker, setNewBroker] = useState({
    broker_name: "",
    api_key: "",
    api_secret: ""
  });

  // Fetch brokers
  const { data: brokers = [], isLoading } = useQuery({
    queryKey: ['brokers'],
    queryFn: api.brokers.getAll,
  });

  // Handle tokenId+state returned in URL after Dhan redirect
  useEffect(() => {
    const tokenId = searchParams.get("tokenId");
    const state = searchParams.get("state");

    if (tokenId && !processingDhan) {
      setProcessingDhan(true);
      handleDhanConnect(tokenId, state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleDhanConnect = useCallback(async (tokenId?: string | null, state?: string | null) => {
    if (!tokenId) {
      setProcessingDhan(false);
      return;
    }
    try {
      toast({ title: "Connecting Dhan...", description: "Exchanging security tokens." });
      await api.brokers.connectDhan({ tokenId, state });
      queryClient.invalidateQueries({ queryKey: ['brokers'] });
      toast({ title: "Success", description: "Dhan account connected securely." });
      setIsAddOpen(false);
      navigate("/settings/accounts", { replace: true });
    } catch (err: any) {
      // extract backend message if present
      const message = err?.response?.data?.detail || err?.message || "Could not complete Dhan authorization";
      toast({ title: "Connection Failed", description: message, variant: "destructive" });
    } finally {
      setProcessingDhan(false);
      // clean URL query params so re-load doesn't re-run
      navigate("/settings/accounts", { replace: true });
    }
  }, [queryClient, navigate, toast]);

  const handleConnectDhanClick = async () => {
    if (redirecting) return;
    setRedirecting(true);
    try {
      const { url } = await api.brokers.getDhanAuthUrl();
      // redirect to Dhan authorize URL (browser will be sent back to frontend with tokenId)
      window.location.href = url;
    } catch (error: any) {
      const message = error?.response?.data?.detail || error?.message || "Could not initiate Dhan login.";
      toast({ title: "Error", description: message, variant: "destructive" });
      setRedirecting(false);
    }
  };

  // Mutations: Add (API-key brokers), Delete, Sync
  const addBrokerMutation = useMutation({
    mutationFn: async () => {
      if (newBroker.broker_name && newBroker.broker_name.toLowerCase() === "dhan") {
        throw new Error("Please use the OAuth button to connect Dhan.");
      }
      if (!newBroker.broker_name || !newBroker.api_key || !newBroker.api_secret) {
        throw new Error("All fields are required");
      }
      return api.brokers.add(newBroker);
    },
    onSuccess: (newAccount) => {
      queryClient.setQueryData(['brokers'], (old: BrokerAccount[] | undefined) => {
        return old ? [newAccount, ...old] : [newAccount];
      });
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
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['brokers'], (old: BrokerAccount[] | undefined) => {
        return old ? old.filter(b => b.id !== deletedId) : [];
      });
      toast({ title: "Removed", description: "Broker account disconnected." });
    }
  });

  const syncBrokerMutation = useMutation({
    mutationFn: api.brokers.sync,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['brokers'] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      toast({ title: "Sync Complete", description: data.message });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || error?.message || "Sync failed";
      toast({ title: "Sync Failed", description: message, variant: "destructive" });
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
                      Securely link your brokerage account.
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
                            <SelectItem value="Dhan">Dhan (OAuth)</SelectItem>
                            <SelectItem value="Zerodha">Zerodha (Kite)</SelectItem>
                            <SelectItem value="Upstox">Upstox</SelectItem>
                            <SelectItem value="Angel One">Angel One</SelectItem>
                            <SelectItem value="Fyers">Fyers</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {newBroker.broker_name === "Dhan" ? (
                       <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-600 mb-2">OAuth Connection Required</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            You will be redirected to Dhan to authorize access. No API keys need to be pasted manually.
                          </p>
                          <Button className="w-full" onClick={handleConnectDhanClick} disabled={redirecting}>
                             {redirecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />} Log in with Dhan
                          </Button>
                       </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    {newBroker.broker_name !== "Dhan" && (
                        <Button onClick={() => addBrokerMutation.mutate()} disabled={addBrokerMutation.isLoading}>
                          {addBrokerMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Connect Securely
                        </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* List Logic */}
            {isLoading ? (
               <div className="flex justify-center py-8 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading accounts...
               </div>
            ) : brokers.length === 0 ? (
               <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                  <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium text-lg">No accounts connected</h3>
               </div>
            ) : (
               <div className="space-y-3">
                  {brokers.map((broker) => (
                    <div key={broker.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg gap-4">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                             <Globe className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{broker.broker_name}</h3>
                                <Badge variant={broker.is_active ? "default" : "secondary"} className="text-[10px] h-5">
                                   {broker.is_active ? "Active" : "Paused"}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 rounded">
                                   ..{broker.api_key_last_digits}
                                </span>
                             </div>
                             <p className="text-xs text-muted-foreground">
                                Last sync: {broker.last_sync_time ? formatDistanceToNow(new Date(broker.last_sync_time), { addSuffix: true }) : "Never"}
                             </p>
                          </div>
                       </div>

                       <div className="flex gap-2 self-end sm:self-center">
                          <Button variant="ghost" size="sm" onClick={() => syncBrokerMutation.mutate(broker.id)} disabled={syncBrokerMutation.isLoading}>
                             <RefreshCw className={`h-4 w-4 mr-2 ${syncBrokerMutation.isLoading ? 'animate-spin' : ''}`} /> Sync
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => deleteBrokerMutation.mutate(broker.id)}>
                             <Trash2 className="h-4 w-4 mr-2" /> Remove
                          </Button>
                       </div>
                    </div>
                  ))}
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
