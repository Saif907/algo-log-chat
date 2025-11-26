import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle, FileText, Mail } from "lucide-react";

export default function About() {
  return (
    <SettingsLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">About & Support</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">TradeLM</h2>
                <p className="text-muted-foreground">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              TradeLM is a comprehensive trading journal and analytics platform designed to help traders improve their performance through data-driven insights and AI-powered analysis.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Support Resources</h2>
            <div className="space-y-3">
              {[
                { icon: MessageCircle, label: "Live Chat Support", action: "Start Chat" },
                { icon: FileText, label: "Documentation", action: "View Docs" },
                { icon: Mail, label: "Email Support", action: "Contact Us" },
              ].map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <resource.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{resource.label}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    {resource.action}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Legal</h2>
            <div className="space-y-2">
              <Button variant="link" className="h-auto p-0 text-sm">
                Terms of Service
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm block">
                Privacy Policy
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm block">
                Cookie Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
