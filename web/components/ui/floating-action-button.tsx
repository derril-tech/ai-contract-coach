// Created automatically by Cursor AI (2025-11-30)
// Floating Action Button (FAB) component for mobile quick actions

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  mainIcon?: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({
  actions,
  mainIcon,
  className,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-20 right-4 z-40 md:hidden", className)}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 -z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Action buttons */}
            <div className="absolute bottom-16 right-0 space-y-3">
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 justify-end"
                >
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className="text-xs font-medium text-text-secondary bg-bg-elevated px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap"
                  >
                    {action.label}
                  </motion.span>
                  <button
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95",
                      action.color || "bg-bg-elevated text-primary hover:bg-bg-subtle"
                    )}
                  >
                    {action.icon}
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors",
          isOpen
            ? "bg-bg-elevated text-text-primary"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          mainIcon || <Plus className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}

