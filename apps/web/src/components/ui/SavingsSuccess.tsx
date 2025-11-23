'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NeoButton from './NeoButton';
import NeomorphicCard from './NeomorphicCard';

type SavingsSuccessProps = {
  rewardAmount: number;
  headline?: string;
  message?: string;
  onStartNewGoal?: () => void;
  onViewDetails?: () => void;
  className?: string;
};

const confetti = Array.from({ length: 12 }).map((_, index) => ({
  id: index,
  delay: index * 0.05,
  left: 8 + index * 7,
  size: 6 + (index % 3),
  color: index % 2 === 0 ? '#FBCC5C' : '#16243D',
}));

function SavingsSuccess({
  rewardAmount,
  headline,
  message,
  onStartNewGoal,
  onViewDetails,
  className,
}: SavingsSuccessProps) {
  const formatted = rewardAmount.toLocaleString();

  return (
    <NeomorphicCard
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-[#FFF8EA] via-[#FFF3D6] to-[#F5F5F7]',
        className,
      )}
    >
      <div className="absolute inset-0 opacity-60" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#16243D] shadow-neo"
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          >
            <svg viewBox="0 0 48 48" className="h-10 w-10">
              <path
                d="M7 17h34l-3 22H10L7 17Z"
                fill="#FBCC5C"
                stroke="#16243D"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M12 17v-4.5A3.5 3.5 0 0 1 15.5 9h17A3.5 3.5 0 0 1 36 12.5V17"
                fill="#F5F5F7"
                stroke="#16243D"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M18 23.5h12" stroke="#16243D" strokeWidth="2.4" strokeLinecap="round" />
              <path
                d="M20 29c1.5 2.2 3.8 3.3 7 3.5"
                stroke="#16243D"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-wide text-[#4B5563]">Goal complete</span>
            <span className="text-2xl font-semibold text-[#16243D]">
              {headline ?? 'You did it!'}
            </span>
            <p className="text-sm text-[#4B5563]">
              {message ?? 'Your savings goal is complete. Enjoy your reward and set a new target.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 shadow-neoSoft">
          <div>
            <p className="text-xs text-[#4B5563]">Reward amount</p>
            <p className="text-2xl font-bold text-[#16243D]">${formatted}</p>
          </div>
          <motion.div
            initial={{ scale: 0.8, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FBCC5C] text-[#16243D] shadow-neo"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
              <path
                d="m5 13.5 4 3.5 10-10"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-3">
          <NeoButton onClick={onStartNewGoal}>Start new goal</NeoButton>
          <NeoButton variant="ghost" onClick={onViewDetails}>
            View details
          </NeoButton>
        </div>
      </div>

      {confetti.map((item) => (
        <motion.span
          key={item.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${item.left}%`,
            width: item.size,
            height: item.size,
            background: item.color,
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: -50 - item.id * 2 }}
          transition={{ delay: 0.2 + item.delay, duration: 1.2, repeat: 0 }}
        />
      ))}
    </NeomorphicCard>
  );
}

export { SavingsSuccess };
export default SavingsSuccess;
