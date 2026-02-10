import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm focus-visible:ring-indigo-500',
      secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus-visible:ring-indigo-500',
      ghost: 'text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-500'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

export const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'high' | 'medium' | 'low' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    high: 'bg-red-100 text-red-700',
    medium: 'bg-orange-100 text-orange-700',
    low: 'bg-green-100 text-green-700'
  };
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
};