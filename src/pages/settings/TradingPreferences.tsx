// frontend/src/pages/settings/TradingPreferences.tsx
import { useState, useEffect } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge"; // ✅ Preserved Badge
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext"; // ✅ Integrated Context
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react"; // ✅ Preserved Icons

interface UserPreferences {
  default_currency: string;
  show_unrealized_pnl: boolean;
  theme_preference?: string;
  // Note: We don't strictly need to store exchange_rate in DB if we fetch it live, 
  // but we can keep it for the UI state.
}

const DEFAULT_PREFERENCES: UserPreferences = {
  default_currency: "USD",
  show_unrealized_pnl: true,
};

export default function TradingPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { refreshCurrency } = useCurrency(); // ✅ Global refresh trigger
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Local state for the rate preview (visual only)
  const [previewRate, setPreviewRate] = useState<number>(1);
  const [rateLoading, setRateLoading] = useState(false);
  
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  // --- 1. Fetch User Preferences on Load ---
  useEffect(() => {
    async function fetchPreferences() {
      if (!user) return;
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data?.preferences) {
          const loaded = data.preferences as Partial<UserPreferences>;
          // Ensure we filter out any old 'default_risk' keys if they exist in DB
          const { default_risk, ...cleanPrefs } = loaded as any;
          setPrefs({ ...DEFAULT_PREFERENCES, ...cleanPrefs });
          
          // Initial fetch of rate for the loaded currency
          if (cleanPrefs.default_currency) {
             fetchLiveRate(cleanPrefs.default_currency);
          }
        }
      } catch (err) {
        console.error("Failed to load preferences:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [user]);

  // --- 2. Live Exchange Rate Logic (Preview) ---
  const fetchLiveRate = async (currency: string) => {
    // Update selection immediately
    setPrefs(prev => ({ ...prev, default_currency: currency }));

    if (currency === "USD") {
      setPreviewRate(1);
      return;
    }

    setRateLoading(true);
    try {
      // Consistent with your snippet
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await res.json();
      
      const rate = data.rates[currency];
      if (rate) {
        setPreviewRate(rate);
        // Optional: Toast only if explicitly triggered by user click, 
        // but for dropdown change it might be too noisy. We'll leave it for now.
      }
    } catch (err) {
      console.error(err);
      toast({ 
        title: "Rate Fetch Failed", 
        description: "Could not fetch live rate preview.", 
        variant: "destructive" 
      });
    } finally {
      setRateLoading(false);
    }
  };

  // --- 3. Save Handler ---
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          preferences: prefs as any, 
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;

      // ✅ CRITICAL: Trigger global app update
      await refreshCurrency(); 

      toast({ title: "Preferences Saved", description: "Your settings have been updated globally." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SettingsLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout>
      <div className="max-w-4xl animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Trading Preferences</h1>
            <p className="text-muted-foreground mt-1">Customize your journal's defaults and display.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || rateLoading}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-8">
            
            {/* Currency Section */}
            <div className="space-y-3">
              <Label htmlFor="currency">Default Currency</Label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-[200px]">
                  <Select 
                    value={prefs.default_currency} 
                    onValueChange={(val) => fetchLiveRate(val)}
                    disabled={rateLoading}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                      <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                      <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                      <SelectItem value="AUD">AUD (A$) - Australian Dollar</SelectItem>
                      <SelectItem value="CAD">CAD (C$) - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ✅ Live Rate Display */}
                <div className="flex items-center gap-2">
                  {rateLoading ? (
                    <Badge variant="outline" className="h-9 px-3 gap-2 text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /> Fetching rate...
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="h-9 px-3 font-mono text-sm">
                      1 USD = {previewRate.toFixed(4)} {prefs.default_currency}
                    </Badge>
                  )}
                  
                  {/* Manual Refresh Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    onClick={() => fetchLiveRate(prefs.default_currency)}
                    title="Refresh Rate"
                  >
                    <RefreshCw className={`h-4 w-4 ${rateLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                We automatically fetch today's exchange rate. This is used to standardize PnL across different assets.
              </p>
            </div>

            {/* ✅ RISK SECTION REMOVED as per instruction */}

            {/* Display Options */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
              <div className="flex-1">
                <Label htmlFor="unrealized" className="text-base font-medium cursor-pointer">
                  Show Unrealized P&L
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Include open positions in your total dashboard PnL.
                </p>
              </div>
              <Switch
                id="unrealized"
                checked={prefs.show_unrealized_pnl}
                onCheckedChange={(val) => setPrefs({...prefs, show_unrealized_pnl: val})}
              />
            </div>

          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}