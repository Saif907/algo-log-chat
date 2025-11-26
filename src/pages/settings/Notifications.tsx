import { useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Notifications() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="email" className="text-base font-medium cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive email updates
                </p>
              </div>
              <Switch
                id="email"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="trade-alerts" className="text-base font-medium cursor-pointer">
                  Trade Alerts
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified about trade executions
                </p>
              </div>
              <Switch
                id="trade-alerts"
                checked={tradeAlerts}
                onCheckedChange={setTradeAlerts}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="market" className="text-base font-medium cursor-pointer">
                  Market Updates
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Daily market news and analysis
                </p>
              </div>
              <Switch
                id="market"
                checked={marketUpdates}
                onCheckedChange={setMarketUpdates}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="weekly" className="text-base font-medium cursor-pointer">
                  Weekly Performance Reports
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Summary of your trading week
                </p>
              </div>
              <Switch
                id="weekly"
                checked={weeklyReports}
                onCheckedChange={setWeeklyReports}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
