'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type IconTileProps = {
  icon: React.ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
};

function IconTile({ icon, label, className, onClick }: IconTileProps) {
  const Wrapper = onClick ? motion.button : motion.div;

  return (
    <div className="flex flex-col items-center gap-2">
      <Wrapper
        type={onClick ? 'button' : undefined}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F5F7] text-[#16243D] shadow-neo',
          className,
        )}
      >
        {icon}
      </Wrapper>
      {label && <span className="text-[11px] font-medium text-[#4B5563]">{label}</span>}
    </div>
  );
}

export { IconTile };
export default IconTile;
