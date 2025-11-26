import { useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AISettings() {
  const [autoTagging, setAutoTagging] = useState(true);
  const [playbookRecommendations, setPlaybookRecommendations] = useState(true);
  const [aiPersonality, setAiPersonality] = useState("professional");

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">AI Settings</h1>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* AI Assistant Configuration */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">AI Assistant Configuration</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Customize how TradeLM interacts with your data.
            </p>

            <div className="space-y-6">
              {/* Auto-Tagging */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="auto-tagging" className="text-base font-medium cursor-pointer">
                    Auto-Tagging
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically tag trades based on behavior.
                  </p>
                </div>
                <Switch
                  id="auto-tagging"
                  checked={autoTagging}
                  onCheckedChange={setAutoTagging}
                />
              </div>

              {/* Playbook Recommendations */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="playbook-recs" className="text-base font-medium cursor-pointer">
                    Playbook Recommendations
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Suggest playbooks for untagged trades.
                  </p>
                </div>
                <Switch
                  id="playbook-recs"
                  checked={playbookRecommendations}
                  onCheckedChange={setPlaybookRecommendations}
                />
              </div>

              {/* AI Personality */}
              <div className="space-y-3">
                <Label htmlFor="ai-personality" className="text-base font-medium">
                  AI Personality
                </Label>
                <Select value={aiPersonality} onValueChange={setAiPersonality}>
                  <SelectTrigger id="ai-personality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional Analyst</SelectItem>
                    <SelectItem value="friendly">Friendly Coach</SelectItem>
                    <SelectItem value="concise">Concise & Direct</SelectItem>
                    <SelectItem value="detailed">Detailed Researcher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
