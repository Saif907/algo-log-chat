// frontend/src/pages/settings/TradingPreferences.tsx
import { useState, useEffect } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UserPreferences {
  default_currency: string;
  default_risk: number;
  show_unrealized_pnl: boolean;
  theme_preference?: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  default_currency: "USD",
  default_risk: 1,
  show_unrealized_pnl: true
};

export default function TradingPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  // Fetch Preferences
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

        if (error && error.code !== 'PGRST116') throw error; // Ignore 'not found' initially

        if (data?.preferences) {
          // Merge with defaults to ensure all keys exist
          const loaded = data.preferences as Partial<UserPreferences>;
          setPrefs({ ...DEFAULT_PREFERENCES, ...loaded });
        }
      } catch (err) {
        console.error("Failed to load preferences:", err);
        // Fallback to defaults is silent
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [user]);

  // Save Preferences
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          preferences: prefs as any, // Cast to JSON
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;

      toast({ title: "Preferences Saved", description: "Your trading settings have been updated." });
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
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-8">
            
            {/* Currency */}
            <div className="space-y-3">
              <Label htmlFor="currency">Default Currency</Label>
              <div className="max-w-xs">
                <Select 
                  value={prefs.default_currency} 
                  onValueChange={(val) => setPrefs({...prefs, default_currency: val})}
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
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">Used for PnL aggregation and reporting.</p>
            </div>

            {/* Risk Management */}
            <div className="space-y-3">
              <Label htmlFor="risk">Default Risk Per Trade (%)</Label>
              <div className="max-w-xs relative">
                <Input
                  id="risk"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={prefs.default_risk}
                  onChange={(e) => setPrefs({...prefs, default_risk: parseFloat(e.target.value)})}
                />
                <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Used to calculate R-Multiples automatically.</p>
            </div>

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