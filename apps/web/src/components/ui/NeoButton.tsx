'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type NeoButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const sizeStyles: Record<NonNullable<NeoButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
};

const variantStyles: Record<NonNullable<NeoButtonProps['variant']>, string> = {
  primary:
    'bg-[#FBCC5C] text-[#16243D] shadow-neo hover:shadow-neo focus-visible:ring-2 focus-visible:ring-[#FBCC5C]/60',
  secondary:
    'bg-[#F5F5F7] text-[#16243D] shadow-neoSoft border border-white/70 focus-visible:ring-2 focus-visible:ring-[#FBCC5C]/40',
  ghost:
    'bg-[#F5F5F7] text-[#4B5563] shadow-neoInset focus-visible:ring-2 focus-visible:ring-[#FBCC5C]/30',
};

const iconClasses = 'flex items-center justify-center';

function NeoButton({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className,
  disabled,
  ...props
}: NeoButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={!disabled ? { scale: 1.03 } : undefined}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-transform duration-150',
        sizeStyles[size],
        variantStyles[variant],
        disabled &&
          'opacity-60 cursor-not-allowed shadow-none hover:shadow-none focus-visible:ring-0',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {iconLeft && <span className={cn(iconClasses, 'text-sm')}>{iconLeft}</span>}
      <span className="whitespace-nowrap">{children}</span>
      {iconRight && <span className={cn(iconClasses, 'text-sm')}>{iconRight}</span>}
    </motion.button>
  );
}

export { NeoButton };
export default NeoButton;
