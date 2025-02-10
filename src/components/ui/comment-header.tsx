import { cn } from '@/lib/utils/utils';
import { ChevronDown } from 'lucide-react';
import { Button } from './button';

interface CommentHeaderProps {
  author: string;
  timestamp: Date;
  className?: string;
  hasReplies?: boolean;
  onToggleReplies?: () => void;
  isModified?: boolean;
}

export function CommentHeader({
  author,
  timestamp,
  className,
  hasReplies,
  onToggleReplies,
  isModified
}: CommentHeaderProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="font-medium text-sm">{author}</span>
      <span className="text-xs text-muted-foreground">
        {formatDate(timestamp)}
      </span>
      {isModified && (
        <span className="text-xs text-muted-foreground">(수정됨)</span>
      )}
      {hasReplies && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto p-0 h-auto"
          onClick={onToggleReplies}
        >
          <ChevronDown className="h-4 w-4" />
          <span className="text-xs ml-1">답글</span>
        </Button>
      )}
    </div>
  );
}
