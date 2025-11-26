import { useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function JournalSettings() {
  const [autoSave, setAutoSave] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(false);
  const [defaultTemplate, setDefaultTemplate] = useState("");

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Journal Settings</h1>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="auto-save" className="text-base font-medium cursor-pointer">
                  Auto-save entries
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically save as you type
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="reminder" className="text-base font-medium cursor-pointer">
                  Daily journal reminder
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified to write your journal
                </p>
              </div>
              <Switch
                id="reminder"
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="template">Default Entry Template</Label>
              <Textarea
                id="template"
                value={defaultTemplate}
                onChange={(e) => setDefaultTemplate(e.target.value)}
                placeholder="Enter your default journal template..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
