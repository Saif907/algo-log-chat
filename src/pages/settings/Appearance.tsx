import { useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function Appearance() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Appearance</h1>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>

        {/* Theme Preferences */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Theme Preferences</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Customize how the app looks on your device.
            </p>

            <div className="space-y-3 mb-6">
              <Label className="text-base font-medium">Interface Theme</Label>
              <div className="grid grid-cols-3 gap-4">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isSelected = theme === themeOption.value;
                  
                  return (
                    <button
                      key={themeOption.value}
                      onClick={() => setTheme(themeOption.value)}
                      className={cn(
                        "relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-full h-24 rounded-lg border-2 flex items-center justify-center transition-colors",
                          themeOption.value === "light" && "bg-white border-gray-300",
                          themeOption.value === "dark" && "bg-gray-900 border-gray-700",
                          themeOption.value === "system" && "bg-gradient-to-br from-white to-gray-900 border-gray-500"
                        )}
                      >
                        <Icon className={cn(
                          "h-8 w-8",
                          themeOption.value === "dark" ? "text-white" : "text-gray-900"
                        )} />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{themeOption.label}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {/* Reduced Motion */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="reduced-motion" className="text-base font-medium cursor-pointer">
                    Reduced Motion
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Minimize animations for better performance.
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={reducedMotion}
                  onCheckedChange={setReducedMotion}
                />
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="compact-mode" className="text-base font-medium cursor-pointer">
                    Compact Mode
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Increase data density in tables.
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
