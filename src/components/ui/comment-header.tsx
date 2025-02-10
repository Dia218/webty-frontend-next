import { cn } from '@/lib/utils/utils';

interface CommentHeaderProps {
  author: string;
  timestamp: Date;
  className?: string;
}

export function CommentHeader({
  author,
  timestamp,
  className,
}: CommentHeaderProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-medium">{author}</span>
      <span className="text-sm text-muted-foreground">
        {timestamp.toLocaleString()}
      </span>
    </div>
  );
}
