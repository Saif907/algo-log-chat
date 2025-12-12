// frontend/src/pages/settings/DataImport.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Upload, Download, FileText, Loader2, AlertCircle } from "lucide-react";

import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";

export default function DataImport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- Mutations ---

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // We pass an empty session ID ("") because this is a new import flow.
      // The backend now accepts optional session_id.
      return api.ai.uploadFile(file, "", "Importing from Settings");
    },
    onSuccess: (data) => {
      toast({
        title: "File Analyzed",
        description: "Redirecting to chat to confirm columns...",
      });
      // Navigate to Chat and pass the analysis data to be rendered immediately
      navigate("/ai-chat", { state: { initialUpload: data } });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      // Reset input to allow retrying same file
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  // --- Handlers ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Max file size is 10MB",
          variant: "destructive",
        });
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  return (
    <SettingsLayout>
      <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data & Import</h1>
            <p className="text-muted-foreground mt-1">
              Manage your trading data, imports, and backups.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Import Card */}
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {uploadMutation.isPending ? (
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  ) : (
                    <Upload className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">Import Trades</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload CSV files from your broker (Zerodha, Binance, etc.) or trading platform.
                      Our AI will automatically detect the columns.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".csv"
                      onChange={handleFileSelect}
                    />
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadMutation.isPending}
                    >
                      {uploadMutation.isPending ? "Analyzing..." : "Choose CSV File"}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Max size: 10MB
                    </span>
                  </div>

                  {uploadMutation.isError && (
                    <div className="flex items-center gap-2 text-sm text-destructive mt-2 bg-destructive/10 p-2 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      <span>{uploadMutation.error.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Export Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download your complete trading history and journal notes as a CSV file.
                  </p>
                  <Button variant="outline">Export to CSV</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Backup & Restore</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create secure snapshots of your journal or restore from a previous point.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" disabled>Create Backup</Button>
                    <Button variant="outline" disabled>Restore</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsLayout>
  );
}