import { useState } from "react";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Profile() {
  const [fullName, setFullName] = useState("Trader");
  const [username, setUsername] = useState("trader123");
  const [email, setEmail] = useState("trader@example.com");
  const [timezone, setTimezone] = useState("utc+0");

  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
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
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  U
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, GIF or PNG. Max size of 800K
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc+0">UTC (GMT+0)</SelectItem>
                    <SelectItem value="utc-5">EST (GMT-5)</SelectItem>
                    <SelectItem value="utc-8">PST (GMT-8)</SelectItem>
                    <SelectItem value="utc+1">CET (GMT+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Irreversible actions for your account.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg">
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
                      and remove all your data from our servers.
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
