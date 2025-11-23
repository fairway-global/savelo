'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NeoButton from './NeoButton';
import NeoButtonGroup from './NeoButtonGroup';
import NeoSlider from './NeoSlider';
import NeomorphicCard from './NeomorphicCard';
import SavingsChestProgress from './SavingsChestProgress';

type SavingsGoalCardProps = {
  title: string;
  currentAmount: number;
  goalAmount: number;
  onAmountChange: (value: number) => void;
  periodValue: string;
  onPeriodChange: (value: string) => void;
  className?: string;
};

function SavingsGoalCard({
  title,
  currentAmount,
  goalAmount,
  onAmountChange,
  periodValue,
  onPeriodChange,
  className,
}: SavingsGoalCardProps) {
  const progress = Math.min(currentAmount / goalAmount, 1);

  return (
    <NeomorphicCard className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#4B5563]">Savings goal</p>
          <h3 className="text-xl font-semibold text-[#16243D]">{title}</h3>
        </div>
        <div className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[#16243D] shadow-neoSoft">
          {Math.round(progress * 100)}% funded
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr,1fr]">
        <div className="flex flex-col gap-3">
          <NeoSlider
            min={20}
            max={500}
            step={5}
            value={currentAmount}
            onChange={onAmountChange}
            label="Contribution"
          />
          <div className="flex items-center justify-between text-sm text-[#4B5563]">
            <span>Selected: </span>
            <span className="font-semibold text-[#16243D]">${currentAmount.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#16243D]">Period</span>
            <NeoButtonGroup
              value={periodValue}
              onChange={onPeriodChange}
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
            />
          </div>

          <motion.div
            className="flex items-center justify-between rounded-neo bg-white/70 px-4 py-3 text-sm text-[#4B5563] shadow-neoSoft"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>Goal</span>
            <span className="font-semibold text-[#16243D]">${goalAmount.toLocaleString()}</span>
          </motion.div>

          <NeoButton className="w-full">Save now</NeoButton>
        </div>

        <SavingsChestProgress
          progress={progress}
          savedAmount={currentAmount}
          goalAmount={goalAmount}
          className="h-full"
        />
      </div>
    </NeomorphicCard>
  );
}

export { SavingsGoalCard };
export default SavingsGoalCard;
