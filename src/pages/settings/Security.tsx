import { useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function Security() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Security</h1>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="2fa" className="text-base font-medium cursor-pointer">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactor}
                  onCheckedChange={setTwoFactor}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="timeout" className="text-base font-medium cursor-pointer">
                    Session Timeout
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Auto logout after inactivity
                  </p>
                </div>
                <Switch
                  id="timeout"
                  checked={sessionTimeout}
                  onCheckedChange={setSessionTimeout}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsLayout>
  );
}
