import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason?: string; // e.g., "Daily AI limit reached"
}

export function UpgradeModal({ isOpen, onClose, triggerReason }: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-amber-500/20 bg-gradient-to-b from-background to-amber-950/5">
        <DialogHeader>
          <div className="mx-auto bg-amber-100 p-3 rounded-full w-fit mb-4">
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-2xl text-center">Unlock Pro Trading Powers</DialogTitle>
          <DialogDescription className="text-center text-lg mt-2">
            {triggerReason || "Upgrade to remove limits and trade smarter."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Free Plan</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-muted-foreground"><Check className="h-4 w-4 mr-2" /> 10 AI Messages/day</li>
              <li className="flex items-center text-muted-foreground"><Check className="h-4 w-4 mr-2" /> Manual Journaling</li>
              <li className="flex items-center text-muted-foreground"><Check className="h-4 w-4 mr-2" /> 1 Strategy</li>
            </ul>
          </div>
          
          <div className="space-y-4 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
            <h3 className="font-semibold text-amber-600 flex items-center">
              <Zap className="h-4 w-4 mr-2 fill-current" /> Pro Plan
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-amber-600" /> 500 AI Messages/day</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-amber-600" /> Auto-Sync Brokers</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-amber-600" /> Real-time Market News</li>
              <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-amber-600" /> Unlimited CSV Exports</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Maybe Later
          </Button>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0">
            Upgrade for $29/mo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}