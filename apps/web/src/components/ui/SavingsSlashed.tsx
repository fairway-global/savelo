'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NeomorphicCard from './NeomorphicCard';

type SavingsSlashedProps = {
  amountSlashed: number;
  message?: string;
  className?: string;
};

function SavingsSlashed({ amountSlashed, message, className }: SavingsSlashedProps) {
  const formatted = `-${amountSlashed.toLocaleString()}`;

  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: [0, -6, 6, -4, 4, 0] }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <NeomorphicCard
        className={cn(
          'relative overflow-hidden bg-[#FEECEC] text-[#D65A5A] shadow-[inset_4px_4px_10px_rgba(214,90,90,0.18),_-4px_-4px_10px_rgba(255,255,255,0.9)]',
          className,
        )}
      >
        <div className="absolute -left-6 top-6 h-1 w-28 rotate-12 rounded-full bg-[#D65A5A]/70" />
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-[#D65A5A] shadow-neo">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor">
              <path
                d="M4 9h16l-2 11H6L4 9Z"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M7 9V6.5A2.5 2.5 0 0 1 9.5 4h5A2.5 2.5 0 0 1 17 6.5V9"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M9.5 12.5h5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-lg font-semibold">Savings slashed</div>
            <div className="text-2xl font-bold text-[#B73D3D]">{formatted}</div>
            <p className="text-sm text-[#8B3B3B]">
              {message ?? 'You missed a payment and your savings were reduced.'}
            </p>
          </div>
        </div>
      </NeomorphicCard>
    </motion.div>
  );
}

export { SavingsSlashed };
export default SavingsSlashed;
