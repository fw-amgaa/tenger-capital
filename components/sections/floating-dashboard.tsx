"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Deposit = {
  id: string;
  amount: string; // formatted
  timeAgo: string;
};

type FloatingDashboardProps = {
  className?: string;
  deposits?: Deposit[];
  cornerOffset?: number; // px gap from edges
  expandMargin?: number; // px margin to viewport when expanded
};

export default function FloatingDashboard({
  className,
  deposits: depositsProp,
  cornerOffset = 40,
  expandMargin = 200,
}: FloatingDashboardProps) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [currentDepositIndex, setCurrentDepositIndex] = useState(0);

  const { scrollY } = useScroll();
  // Trigger compact mode when scrolled beyond threshold; independent of distance
  const threshold = 140;
  useMotionValueEvent(scrollY, "change", (v) => {
    const shouldCompact = v >= threshold;
    setCompact((prev) => (prev !== shouldCompact ? shouldCompact : prev));
  });

  // For legacy transforms, keep constants
  const DASH_W = 260;
  const DASH_H = 30;
  const DEP_H = 128;
  const expandedHeight = `calc(100vh - ${expandMargin}px)`;

  const deposits: Deposit[] = useMemo(
    () =>
      depositsProp ?? [
        { id: "1", amount: "$5,000.00", timeAgo: "5 hours ago" },
        { id: "2", amount: "$2,400.00", timeAgo: "1 day ago" },
        { id: "3", amount: "$12,000.00", timeAgo: "3 days ago" },
      ],
    [depositsProp]
  );

  // Auto-cycle through deposits every 4 seconds (pause when hidden or dashboard is open)
  useEffect(() => {
    if (deposits.length === 0 || compact || open) return;
    const interval = setInterval(() => {
      setCurrentDepositIndex((prev) => (prev + 1) % deposits.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [deposits.length, compact, open]);

  return (
    <div className={className}>
      <motion.div
        className="fixed z-50"
        style={{ right: cornerOffset, bottom: cornerOffset }}
      >
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="flex flex-col items-end gap-2"
              >
                {/* Dashboard pill with blur */}
                <motion.div
                  animate={{ y: 0 }}
                  transition={{ stiffness: 260, damping: 26 }}
                >
                  <button
                    onClick={() => setOpen(true)}
                    className={cn(
                      "group relative inline-flex items-center justify-between px-3 rounded-[8px] cursor-pointer",
                      "backdrop-blur-md bg-white/10",
                    )}
                    style={{ width: DASH_W, height: DASH_H }}
                  >
                    <motion.span layoutId="dash-label" className="text-[12px] leading-none text-white/50 group-hover:text-white">
                      Dashboard
                    </motion.span>
                    <div className="opacity-50 group-hover:opacity-100"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" fill="none"><path fill="currentColor" d="M2.583.833a1.25 1.25 0 0 0-1.25 1.25v5.834a1.25 1.25 0 0 0 1.25 1.25h5.834a1.25 1.25 0 0 0 1.25-1.25V6.058a.417.417 0 1 1 .833 0v1.859A2.083 2.083 0 0 1 8.417 10H2.583A2.083 2.083 0 0 1 .5 7.917V2.083A2.083 2.083 0 0 1 2.583 0h1.859a.417.417 0 0 1 0 .833zM6.142.417A.417.417 0 0 1 6.558 0h3.525a.417.417 0 0 1 .417.417v3.525a.417.417 0 0 1-.833 0V1.423L6.853 4.237a.417.417 0 1 1-.59-.59L9.078.833h-2.52A.417.417 0 0 1 6.14.417"></path></svg></div>
                  </button>
                </motion.div>

                {/* Latest Deposits card (no blur) */}
                <motion.div
                  animate={{ opacity: compact ? 0 : 1, height: compact ? 0 : DEP_H, padding: compact ? 0 : 8, }}
                  transition={{ duration: 0.25 }}
                  style={{ width: DASH_W }}
                  className="flex flex-col justify-between rounded-[8px] bg-white/10 text-white/80 ring-1 ring-white/10 overflow-hidden h-full px-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] text-white/50">Latest Deposits</div>
                    <div className="text-right"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" fill="none"><path fill="currentColor" fillRule="evenodd" d="M11.072 2.472 2.256 5.66l2.937 1.7 2.59-2.591a.7.7 0 1 1 .99.99L6.183 8.35l1.7 2.936zM11.298.9c.836-.303 1.647.507 1.344 1.344L8.944 12.47c-.304.84-1.45.941-1.897.17L4.795 8.747.904 6.496c-.772-.448-.67-1.593.169-1.897z" clipRule="evenodd" opacity="0.4"></path></svg></div>
                  </div>
                  <div className="flex items-end justify-between relative w-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDepositIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex items-end justify-between w-full"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            opacity: { duration: 0.3 },
                          }}
                          className="text-xl tracking-tight"
                        >
                          ${deposits[currentDepositIndex]?.amount}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            opacity: { duration: 0.3, delay: 0.15 },
                            x: { duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
                          }}
                          className="text-[9px]"
                        >
                          {deposits[currentDepositIndex]?.timeAgo}
                        </motion.div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {open && (
            <motion.div
              key="expanded"
              className="pointer-events-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                layout
                className="rounded-[16px] bg-white text-black shadow-xl ring-1 ring-black/10 overflow-hidden"
                initial={{ height: 30, width: 260 }}
                animate={{ height: expandedHeight, width: 260 }}
                exit={{ height: 30, width: 260 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between px-3 h-10 border-b border-black/10">
                  <span className="text-[12px] font-medium">Dashboard</span>
                  <button
                    onClick={() => setOpen(false)}
                    className="grid place-items-center w-8 h-8 rounded-md hover:bg-black/[0.04]"
                  >
                    ✕
                  </button>
                </div>

                {/* Content list */}
                <div className="max-h-[calc(100%-40px)] overflow-y-auto">
                  <ul className="divide-y divide-black/6">
                    {deposits.map((d) => (
                      <li key={d.id} className="flex items-center justify-between px-5 py-4">
                        <div className="text-[15px] text-black/80">Deposit</div>
                        <div className="text-black/90 font-medium">{d.amount}</div>
                        <div className="text-[13px] text-black/50">{d.timeAgo}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}


