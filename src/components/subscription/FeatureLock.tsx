import React from 'react';
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { triggerUpgradeModal } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface FeatureLockProps {
  children: React.ReactNode;
  isLocked?: boolean; // Can manually override
  featureName?: string;
  showBlur?: boolean; // If true, blurs the children. If false, hides them completely.
}

export const FeatureLock: React.FC<FeatureLockProps> = ({ 
  children, 
  isLocked, 
  featureName = "Pro Feature",
  showBlur = true 
}) => {
  // In a real app, you'd get the plan from context. 
  // For now, we assume the parent component checks the plan or passes 'isLocked'.
  // But let's verify via auth context if available.
  
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group overflow-hidden rounded-xl border border-dashed border-amber-500/30">
      {/* The Actual Content (Blurred or Hidden) */}
      <div className={showBlur ? "blur-sm opacity-50 pointer-events-none select-none" : "hidden"}>
        {children}
      </div>

      {/* The Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] transition-all duration-300">
        <div className="bg-background/90 p-4 rounded-full shadow-xl border border-amber-100 mb-3 group-hover:scale-110 transition-transform">
          <Lock className="w-6 h-6 text-amber-600" />
        </div>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {featureName} <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">Pro</span>
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-[250px] text-center">
          Upgrade to unlock this advanced trading tool.
        </p>
        <Button 
          size="sm" 
          onClick={() => triggerUpgradeModal(`Unlock ${featureName}`)}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md"
        >
          <Sparkles className="w-4 h-4 mr-2 fill-white/20" /> 
          Unlock Now
        </Button>
      </div>
    </div>
  );
};