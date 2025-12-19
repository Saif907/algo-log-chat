// src/contexts/ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
// 👇 Ensure this path points to your actual UpgradeModal component
import { UpgradeModal } from '@/components/subscription/UpgradeModal'; 

interface ModalContextType {
  openUpgradeModal: (reason?: string) => void;
  closeUpgradeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<string>("");

  const openUpgradeModal = (triggerReason?: string) => {
    setReason(triggerReason || "");
    setIsOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsOpen(false);
    setReason("");
  };

  return (
    <ModalContext.Provider value={{ openUpgradeModal, closeUpgradeModal }}>
      {children}
      <UpgradeModal isOpen={isOpen} onClose={closeUpgradeModal} triggerReason={reason} />
    </ModalContext.Provider>
  );
}

// 👇 This is the export. Do NOT import this function at the top of this file.
export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}