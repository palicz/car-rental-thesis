'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateSelectorProps = {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
  required?: boolean;
};

export function DateSelector({
  dateRange,
  onDateRangeChange,
  className,
  required = true,
}: DateSelectorProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            id="date"
            className={cn(
              'group relative w-full cursor-pointer justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground',
              'border-input bg-background ring-offset-background hover:border-primary/50 hover:bg-accent/50 focus:border-primary focus:ring-ring flex h-12 w-full items-center justify-between rounded-lg border px-4 py-2 text-sm transition-all focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              required && !dateRange && 'border-destructive/50',
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon
                className={cn(
                  'text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors',
                  required && !dateRange && 'text-destructive',
                )}
              />
              <div className="flex flex-col items-start">
                <span
                  className={cn(
                    'text-muted-foreground text-xs',
                    required && !dateRange && 'text-destructive',
                  )}
                >
                  {required ? 'Select dates (required)' : 'Select dates'}
                </span>
                {dateRange?.from ? (
                  dateRange.to ? (
                    <span className="text-foreground font-medium">
                      {format(dateRange.from, 'MMM dd')} -{' '}
                      {format(dateRange.to, 'MMM dd, yyyy')}
                    </span>
                  ) : (
                    <span className="text-foreground font-medium">
                      {format(dateRange.from, 'MMM dd, yyyy')}
                    </span>
                  )
                ) : (
                  <span
                    className={cn(
                      'font-medium',
                      required && 'text-destructive/90',
                    )}
                  >
                    Choose your rental period
                  </span>
                )}
              </div>
            </div>
            {dateRange?.from && dateRange?.to && (
              <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                {Math.ceil(
                  (dateRange.to.getTime() - dateRange.from.getTime()) /
                    (1000 * 60 * 60 * 24),
                )}{' '}
                days
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="border-b p-3">
            <h3 className="font-medium">Select rental period</h3>
            <p className="text-muted-foreground text-xs">
              Choose your pickup and return dates
            </p>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            disabled={date => date < new Date()}
            classNames={{
              months:
                'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
              month: 'space-y-4',
              caption: 'flex justify-center pt-1 relative items-center',
              caption_label: 'text-sm font-medium',
              nav: 'space-x-1 flex items-center',
              nav_button: cn(
                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
              ),
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full border-collapse space-y-1',
              head_row: 'flex',
              head_cell:
                'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
              row: 'flex w-full mt-2',
              cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
              day: cn('h-9 w-9 p-0 font-normal aria-selected:opacity-100'),
              day_range_end: 'day-range-end',
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
              day_today: 'bg-accent text-accent-foreground',
              day_outside:
                'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
              day_disabled: 'text-muted-foreground opacity-50',
              day_range_middle:
                'aria-selected:bg-accent aria-selected:text-accent-foreground',
              day_hidden: 'invisible',
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
