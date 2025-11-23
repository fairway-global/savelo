'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NeomorphicCard from './NeomorphicCard';

type SavingsChestProgressProps = {
  progress: number; // 0 - 1
  goalAmount: number;
  savedAmount: number;
  className?: string;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

function SavingsChestProgress({
  progress,
  goalAmount,
  savedAmount,
  className,
}: SavingsChestProgressProps) {
  const size = 180;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const percentLabel = Math.round(clamped * 100);

  return (
    <NeomorphicCard className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="text-[#D1D5DB]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.35}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FBCC5C"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: circumference * (1 - clamped) }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="drop-shadow-md"
          />
        </svg>
        <div className="absolute flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#F5F5F7] shadow-neo">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-neoSoft">
            <svg viewBox="0 0 64 48" className="h-7 w-7 text-[#16243D]">
              <path
                d="M10 18h44l-4 24H14L10 18Z"
                fill="#FBCC5C"
                stroke="#16243D"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M14 18V9c0-1.1.9-2 2-2h32c1.1 0 2 .9 2 2v9"
                fill="#F5F5F7"
                stroke="#16243D"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 24h16"
                stroke="#16243D"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm font-semibold text-[#16243D]">{percentLabel}%</div>
            <div className="text-[11px] text-[#4B5563]">toward goal</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 text-sm text-[#4B5563]">
        <span className="text-[#16243D] font-semibold">
          {formatCurrency(savedAmount)} / {formatCurrency(goalAmount)}
        </span>
        <span>Active chest</span>
      </div>
    </NeomorphicCard>
  );
}

export { SavingsChestProgress };
export default SavingsChestProgress;
