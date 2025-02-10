import { cn } from '@/lib/utils/utils';
import { HTMLAttributes } from 'react';

interface CommentContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CommentContent({
  className,
  children,
  ...props
}: CommentContentProps) {
  return (
    <div
      className={cn('mt-2 text-sm text-foreground/90 whitespace-pre-wrap', className)}
      {...props}
    >
      {children}
    </div>
  );
}
