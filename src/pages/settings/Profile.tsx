// frontend/src/pages/settings/Profile.tsx
import { useState, useEffect } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    timezone: "utc+0"
  });

  // Load User Data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || "",
        username: user.user_metadata?.username || "",
        email: user.email || "",
        timezone: user.user_metadata?.timezone || "utc+0"
      });
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: any = {
        data: {
          full_name: formData.fullName,
          username: formData.username,
          timezone: formData.timezone,
        }
      };

      // Only include email if it changed (triggers confirmation flow)
      if (formData.email !== user?.email) {
        updates.email = formData.email;
      }

      const { error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      toast({ 
        title: "Profile Updated", 
        description: formData.email !== user?.email 
          ? "Please check your new email for a confirmation link." 
          : "Your changes have been saved."
      });
      
    } catch (error: any) {
      toast({ 
        title: "Update Failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      setLoading(true);
      
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // 3. Update User Metadata
      await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });

      setAvatarUrl(data.publicUrl);
      toast({ title: "Avatar Updated" });

    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsLayout>
      <div className="max-w-4xl animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your public profile and private details.
            </p>

            {/* Avatar Upload */}
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <User />}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                    Change Avatar
                  </div>
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={loading}
                  />
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Display Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={formData.timezone} 
                  onValueChange={(val) => setFormData({...formData, timezone: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc+0">UTC (GMT+0)</SelectItem>
                    <SelectItem value="utc-5">EST (New York)</SelectItem>
                    <SelectItem value="utc-8">PST (Los Angeles)</SelectItem>
                    <SelectItem value="utc+1">CET (London/Paris)</SelectItem>
                    <SelectItem value="ist">IST (India)</SelectItem>
                    <SelectItem value="jst">JST (Tokyo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Irreversible actions for your account.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-background border border-destructive/20 rounded-lg">
              <div>
                <h3 className="font-medium mb-1">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your account and all data.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your trading data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}