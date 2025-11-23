'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NeomorphicCard from './NeomorphicCard';

type MiniMetricsBarsProps = {
  items: { label: string; value: number }[];
  className?: string;
};

function MiniMetricsBars({ items, className }: MiniMetricsBarsProps) {
  return (
    <NeomorphicCard className={cn('p-4', className)}>
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-[#16243D]">
        <span>Progress</span>
        <span className="text-[#4B5563]">Today vs timeframe</span>
      </div>
      <div className="grid grid-cols-4 gap-3 text-center">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-[#16243D]">{item.value}%</span>
            <div className="relative h-20 w-3 rounded-full bg-[#F5F5F7] shadow-neoInset">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(item.value, 100)}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute bottom-0 left-0 right-0 rounded-full bg-[#FBCC5C]"
              />
            </div>
            <span className="text-[11px] font-medium text-[#4B5563]">{item.label}</span>
          </div>
        ))}
      </div>
    </NeomorphicCard>
  );
}

export { MiniMetricsBars };
export default MiniMetricsBars;
