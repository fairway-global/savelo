'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NeomorphicCard from './NeomorphicCard';

type StreakStarsProps = {
  totalDays: number;
  streakMap: boolean[];
  className?: string;
};

function StreakStars({ totalDays, streakMap, className }: StreakStarsProps) {
  const items = Array.from({ length: totalDays }).map((_, index) => streakMap[index]);

  return (
    <NeomorphicCard className={cn('flex items-center gap-2', className)}>
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-wide text-[#4B5563]">Streak</span>
        <span className="text-lg font-semibold text-[#16243D]">
          {items.filter(Boolean).length} / {totalDays}
        </span>
      </div>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {items.map((hit, index) => (
          <motion.span
            key={index}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: hit ? 1.05 : 1, opacity: 1 }}
            transition={{ delay: index * 0.03, type: 'spring', stiffness: 240, damping: 16 }}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F5F7] shadow-neoSoft',
              hit ? 'text-[#FBCC5C]' : 'text-[#D1D5DB]',
            )}
            aria-label={hit ? 'Completed day' : 'Missed day'}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill={hit ? '#FBCC5C' : 'none'}
              stroke={hit ? '#16243D' : '#D1D5DB'}
              strokeWidth={1.6}
            >
              <path d="m12 3 2.5 6.5L21 10l-4.8 4 1.5 6-5.7-3.4L6.3 20l1.5-6L3 10l6.5-.5L12 3Z" />
            </svg>
          </motion.span>
        ))}
      </div>
    </NeomorphicCard>
  );
}

export { StreakStars };
export default StreakStars;
