import { useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function TradingPreferences() {
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [riskPerTrade, setRiskPerTrade] = useState("2");
  const [showUnrealizedPnL, setShowUnrealizedPnL] = useState(true);

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Trading Preferences</h1>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="risk">Default Risk Per Trade (%)</Label>
              <Input
                id="risk"
                type="number"
                value={riskPerTrade}
                onChange={(e) => setRiskPerTrade(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="unrealized" className="text-base font-medium cursor-pointer">
                  Show Unrealized P&L
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Display open position values
                </p>
              </div>
              <Switch
                id="unrealized"
                checked={showUnrealizedPnL}
                onCheckedChange={setShowUnrealizedPnL}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
