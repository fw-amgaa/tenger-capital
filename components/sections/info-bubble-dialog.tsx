"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useId, useMemo } from "react";

type InfoBubbleDialogProps = {
  items: string[];
  className?: string;
  buttonClassName?: string;
};

export default function InfoBubbleDialog({ items, className, buttonClassName }: InfoBubbleDialogProps) {
  const layoutId = useId();
  const numbered = useMemo(() => items.map((t, i) => `(${i + 1}) ${t}`), [items]);

  return (
    <LayoutGroup id={`info-${layoutId}`}>
      <Dialog>
        <DialogTrigger asChild>
          <motion.button
            type="button"
            className={cn(
              "grid place-items-center w-6 h-6 rounded-full",
              "bg-[rgba(248,248,248,0.08)] text-white/90",
              "hover:bg-[rgba(248,248,248,0.14)] transition-colors",
              buttonClassName,
            )}
          >
            <motion.div layoutId={`bubble-${layoutId}`} className="w-full h-full rounded-full" />
            <span className="absolute text-xs leading-none">i</span>
          </motion.button>
        </DialogTrigger>

        {/* Portal content */}
        <AnimatePresence>
          {/* Overlay uses existing shadcn fade; leaving as-is to match screenshot */}
        </AnimatePresence>

        <DialogContent showCloseButton={false} className={cn("border-0 p-0 bg-transparent shadow-none", className)}>
          <DialogTitle />
          {/* Replace default card with our morph surface */}
          <div className="relative grid place-items-center p-1">
            <motion.div
              layoutId={`bubble-${layoutId}`}
              className="relative w-full max-w-[450px] bg-[#1a1a1a] text-white/85 rounded-[18px]"
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="backdrop-blur-md rounded-[18px] overflow-hidden">
                <div className="p-6 md:p-7">
                  <div className="max-h-[70vh] overflow-y-auto pr-1">
                    <ul className="space-y-4 text-[10px] leading-[120%]">
                      {numbered.map((line, i) => (
                        <li key={i} className="text-white/50">{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </LayoutGroup>
  );
}


