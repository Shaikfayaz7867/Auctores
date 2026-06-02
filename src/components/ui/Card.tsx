import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline' | 'flat';
  className?: string;
  children?: React.ReactNode;
  key?: any;
  onClick?: any;
}

export const Card = ({ className = '', variant = 'default', children, ...props }: CardProps) => {
  const baseStyles = 'rounded-lg overflow-hidden transition-all duration-200';
  
  const variants: Record<string, string> = {
    default: 'bg-white border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:shadow-none',
    outline: 'bg-transparent border border-slate-200 dark:border-slate-800',
    flat: 'bg-slate-50 border-0 dark:bg-slate-900/50',
    glass: 'glass shadow-glass dark:shadow-glass-dark border border-white/20'
  };

  return (
    <div
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={twMerge('text-lg font-serif font-semibold text-slate-900 dark:text-white', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={twMerge('text-sm text-slate-500 dark:text-slate-400 mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('p-6', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2', className)} {...props}>
    {children}
  </div>
);
