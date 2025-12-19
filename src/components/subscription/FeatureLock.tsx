import React from 'react';
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
// ✅ Uses the Context Hook we created
import { useModal } from "@/contexts/ModalContext";

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
  
  // Connect to the global modal context
  const { openUpgradeModal } = useModal();
  
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group overflow-hidden rounded-xl border border-dashed border-amber-500/30">
      {/* The Actual Content (Blurred or Hidden) */}
      <div className={showBlur ? "blur-sm opacity-50 pointer-events-none select-none filter grayscale-[0.5]" : "hidden"}>
        {children}
      </div>

      {/* The Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] transition-all duration-300">
        <div className="bg-background/90 p-4 rounded-full shadow-xl border border-amber-100 mb-3 group-hover:scale-110 transition-transform duration-300">
          <Lock className="w-6 h-6 text-amber-600" />
        </div>
        
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {featureName} <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">PRO</span>
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 max-w-[250px] text-center mt-1">
          Upgrade to unlock this advanced tool.
        </p>
        
        <Button 
          size="sm" 
          onClick={() => openUpgradeModal(`Unlock ${featureName}`)}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md transition-all hover:shadow-amber-500/25"
        >
          <Sparkles className="w-3.5 h-3.5 mr-2 fill-white/20" /> 
          Unlock Now
        </Button>
      </div>
    </div>
  );
};