'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type NeomorphicCardProps<E extends keyof JSX.IntrinsicElements = 'div'> = {
  children: React.ReactNode;
  className?: string;
  as?: E;
} & Omit<React.ComponentPropsWithoutRef<E>, 'as' | 'children' | 'className'>;

/**
 * Neomorphic container with soft elevation and rounded corners.
 */
function NeomorphicCard<E extends keyof JSX.IntrinsicElements = 'div'>({
  children,
  className,
  as,
  ...props
}: NeomorphicCardProps<E>) {
  const Component = (as || 'div') as React.ElementType;

  return (
    <Component
      className={cn(
        'bg-[#F5F5F7] text-neo-ink/90 rounded-neo shadow-neo p-4',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export { NeomorphicCard };
export default NeomorphicCard;
