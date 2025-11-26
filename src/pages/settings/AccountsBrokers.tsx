import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, RefreshCw, Settings } from "lucide-react";

const mockBrokers = [
  { name: "Interactive Brokers", status: "Connected", badge: "Live", lastSync: "2 mins ago" },
  { name: "Binance", status: "Needs Auth", badge: "Crypto", lastSync: "Failed" },
  { name: "Paper Trading", status: "Connected", badge: "Sim", lastSync: "Real-time" },
];

export default function AccountsBrokers() {
  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Accounts & Brokers</h1>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Connected Brokers */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Connected Brokers</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your integrations and data sources.
                </p>
              </div>
              <Button>
                <span className="mr-2">+</span>
                Connect Broker
              </Button>
            </div>

            <div className="space-y-3">
              {mockBrokers.map((broker, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Globe className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{broker.name}</h3>
                        <Badge
                          variant={broker.status === "Connected" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {broker.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {broker.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last sync: {broker.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
