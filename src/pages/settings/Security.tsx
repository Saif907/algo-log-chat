// frontend/src/pages/settings/Security.tsx
import { useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert, Lock } from "lucide-react";

export default function Security() {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Toggles (Placeholder state for future implementation)
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);

  const handleUpdatePassword = async () => {
    // 1. Validation
    if (!newPassword || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all password fields.", variant: "destructive" });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // 2. Call Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({ title: "Success", description: "Your password has been updated." });
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureNotReady = () => {
    toast({ title: "Coming Soon", description: "This security feature is coming in the next update." });
  };

  return (
    <SettingsLayout>
      <div className="max-w-4xl animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Security</h1>
            <p className="text-muted-foreground mt-1">Manage your password and account security.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Change Password Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Change Password</h2>
              </div>
              
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input 
                    id="new" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input 
                    id="confirm" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retype password"
                  />
                </div>
                
                <div className="pt-2">
                  <Button onClick={handleUpdatePassword} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Security Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Advanced Protection</h2>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex-1">
                  <Label htmlFor="2fa" className="text-base font-medium cursor-pointer">
                    Two-Factor Authentication (2FA)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Secure your account with an authenticator app.
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactor}
                  onCheckedChange={(v) => { setTwoFactor(v); if(v) handleFeatureNotReady(); }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex-1">
                  <Label htmlFor="timeout" className="text-base font-medium cursor-pointer">
                    Strict Session Timeout
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Auto-logout after 15 minutes of inactivity.
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