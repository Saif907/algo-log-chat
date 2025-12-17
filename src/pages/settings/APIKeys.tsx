import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eye, EyeOff, Trash2 } from "lucide-react";

export default function APIKeys() {
  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">API Keys</h1>
          <Button>Generate New Key</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Active API Keys</h2>
            <div className="space-y-3">
              {[
                { name: "Production Key", key: "sk_live_••••••••••••••••", created: "Dec 1, 2024" },
                { name: "Development Key", key: "sk_test_••••••••••••••••", created: "Nov 15, 2024" },
              ].map((apiKey, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium mb-1">{apiKey.name}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-muted-foreground">{apiKey.key}</code>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Created {apiKey.created}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">API Documentation</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Learn how to integrate TradeOmen with your applications
            </p>
            <Button variant="outline">View Documentation</Button>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
