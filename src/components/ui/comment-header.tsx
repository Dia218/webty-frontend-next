import { cn } from '@/lib/utils/utils';

interface CommentHeaderProps {
  author: string;
  timestamp: Date;
  isModified?: boolean;
  className?: string;
}

export function CommentHeader({
  author,
  timestamp,
  isModified = false,
  className,
}: CommentHeaderProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-medium">{author}</span>
      <span className="text-sm text-muted-foreground">
        {timestamp.toLocaleString()}
      </span>
      {isModified && (
        <span className="text-sm text-muted-foreground">(수정됨)</span>
      )}
    </div>
  );
}
