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
  
  const handleUpgrade = () => {
    // TODO: Add your Stripe/LemonSqueezy checkout link here
    window.open("https://checkout.stripe.com/c/pay/...", "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] border-amber-500/20 bg-gradient-to-b from-background to-amber-950/5 p-0 overflow-hidden gap-0">
        
        {/* Header Section */}
        <div className="p-6 text-center pb-2">
          <div className="mx-auto bg-amber-100 p-3 rounded-full w-fit mb-4">
            <Sparkles className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-2xl font-bold">Unlock Pro Trading Powers</DialogTitle>
          <DialogDescription className="text-lg mt-2 text-muted-foreground">
            {triggerReason || "Upgrade to remove limits and trade smarter."}
          </DialogDescription>
        </div>

        {/* Plans Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-0 border-y border-border/50">
          
          {/* Free Plan Column */}
          <div className="p-6 space-y-4 bg-muted/20">
            <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
              Free Plan
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" /> 
                10 AI Messages/day
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" /> 
                1 Strategy Limit
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" /> 
                Manual Journaling Only
              </li>
              <li className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" /> 
                Basic Charts
              </li>
            </ul>
          </div>
          
          {/* Pro Plan Column */}
          <div className="p-6 space-y-4 bg-amber-500/5 relative">
             <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold tracking-wider">
               RECOMMENDED
             </div>
            <h3 className="font-bold text-amber-600 flex items-center gap-2">
              <Zap className="h-4 w-4 fill-current" /> Pro Plan
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" /> 500 AI Messages/day
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" /> Unlimited Strategies
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" /> Auto-Sync Brokers
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" /> Real-time Market News
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-600" /> Unlimited CSV Exports
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-6 bg-muted/20 flex-col sm:flex-row gap-3">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Maybe Later
          </Button>
          <Button 
            onClick={handleUpgrade} 
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-amber-500/20"
          >
            Upgrade for $29/mo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}