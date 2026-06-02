import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = '', ...props }: React.HTMLAttributes<HTMLTableElement>, ref: React.Ref<HTMLTableElement>) => (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800">
      <table
        ref={ref}
        className={twMerge('w-full caption-bottom text-sm font-sans text-slate-950 dark:text-slate-200 border-collapse', className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>, ref: React.Ref<HTMLTableSectionElement>) => (
    <thead ref={ref} className={twMerge('bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>, ref: React.Ref<HTMLTableSectionElement>) => (
    <tbody ref={ref} className={twMerge('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>, ref: React.Ref<HTMLTableRowElement>) => (
    <tr
      ref={ref}
      className={twMerge(
        'border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors duration-150',
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>, ref: React.Ref<HTMLTableCellElement>) => (
    <th
      ref={ref}
      className={twMerge(
        'h-12 px-6 text-left align-middle font-semibold text-slate-700 dark:text-slate-300 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>, ref: React.Ref<HTMLTableCellElement>) => (
    <td
      ref={ref}
      className={twMerge('py-4 px-6 align-middle [&:has([role=checkbox])]:pr-0 text-slate-600 dark:text-slate-300', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';
