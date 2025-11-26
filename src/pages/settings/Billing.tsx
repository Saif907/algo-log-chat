import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function Billing() {
  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <Button variant="outline">Manage Billing</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Current Plan</h2>
                <p className="text-sm text-muted-foreground">
                  You are currently on the Pro Plan
                </p>
              </div>
              <Badge className="text-sm px-3 py-1">Pro Plan</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Billing Cycle</p>
                <p className="text-lg font-semibold">Monthly</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Next Payment</p>
                <p className="text-lg font-semibold">$29.99 on Jan 15</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Plan Features:</p>
              <ul className="space-y-2">
                {["Unlimited trades", "Advanced analytics", "AI insights", "Priority support"].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payment History</h2>
            <div className="space-y-3">
              {[
                { date: "Dec 15, 2024", amount: "$29.99", status: "Paid" },
                { date: "Nov 15, 2024", amount: "$29.99", status: "Paid" },
                { date: "Oct 15, 2024", amount: "$29.99", status: "Paid" },
              ].map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{payment.amount}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <Badge variant="outline">{payment.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
