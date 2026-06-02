import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: (SelectOption | string)[];
  error?: string;
  className?: string;
  id?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, options, error, id, ...props }: SelectProps, ref: React.Ref<HTMLSelectElement>) => {
    const selectId = id || `select-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={twMerge(
            clsx(
              'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100',
              error && 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-500'
            ),
            className
          )}
          {...props}
        >
          {options.map((opt, idx) => {
            const isString = typeof opt === 'string';
            const value = isString ? opt : opt.value;
            const labelText = isString ? opt : opt.label;
            return (
              <option key={idx} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>
        {error && (
          <p className="text-xs text-rose-500 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
