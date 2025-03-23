'use client';

import { createContext, type HTMLAttributes, useContext } from 'react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeContextType = {
  themed: boolean;
};

const BadgeContext = createContext<BadgeContextType>({
  themed: false,
});

const useBadgeContext = () => {
  const context = useContext(BadgeContext);

  if (!context) {
    throw new Error('useBadgeContext must be used within a Badge');
  }

  return context;
};

export type AnnouncementProps = BadgeProps & {
  themed?: boolean;
};

export const Announcement = ({
  variant = 'outline',
  themed = false,
  className,
  ...props
}: AnnouncementProps) => (
  <BadgeContext.Provider value={{ themed }}>
    <Badge
      variant={variant}
      className={cn(
        'bg-background max-w-full gap-2 rounded-full px-3 py-0.5 font-medium shadow-sm transition-all',
        'hover:shadow-md',
        themed && 'border-foreground/5',
        className,
      )}
      {...props}
    />
  </BadgeContext.Provider>
);

export type AnnouncementTagProps = HTMLAttributes<HTMLDivElement>;

export const AnnouncementTag = ({
  className,
  ...props
}: AnnouncementTagProps) => {
  const { themed } = useBadgeContext();

  return (
    <div
      className={cn(
        'bg-foreground/5 -ml-2.5 shrink-0 truncate rounded-full px-2.5 py-1 text-xs',
        themed && 'bg-background/60',
        className,
      )}
      {...props}
    />
  );
};

export type AnnouncementTitleProps = HTMLAttributes<HTMLDivElement>;

export const AnnouncementTitle = ({
  className,
  ...props
}: AnnouncementTitleProps) => (
  <div
    className={cn('flex items-center gap-1 truncate py-1', className)}
    {...props}
  />
);
