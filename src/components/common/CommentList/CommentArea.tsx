'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { MentionSuggestions } from './MentionSuggestions';  

interface CommentAreaProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialContent?: string;
  placeholder?: string;
  existingUsers: UserDataResponseDto[];
}

const CommentArea = ({
  onSubmit,
  onCancel,
  initialContent = '',
  placeholder = '댓글을 입력하세요...',
  existingUsers
}: CommentAreaProps) => {
  const [content, setContent] = useState(initialContent);
  const [suggestions, setSuggestions] = useState<UserDataResponseDto[]>([]);
  const [mentionStartIndex, setMentionStartIndex] = useState<number>(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
      setSuggestions([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // 멘션 제안 처리
    const lastAtIndex = newContent.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const query = newContent.slice(lastAtIndex + 1).split(/[\s\n]/)[0].toLowerCase();
      if (query) {
        const filtered = existingUsers.filter(user => 
          user.nickname.toLowerCase().includes(query)
        );
        setSuggestions(filtered);
        setMentionStartIndex(lastAtIndex);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (user: UserDataResponseDto) => {
    if (mentionStartIndex !== -1) {
      const before = content.slice(0, mentionStartIndex);
      const after = content.slice(mentionStartIndex).split(/[\s\n]/);
      after[0] = `@${user.nickname}`;
      setContent(before + after.join(' '));
      setSuggestions([]);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full min-h-[100px] resize-y"
        />
        {suggestions.length > 0 && (
          <MentionSuggestions
            users={suggestions}
            onSelect={handleSuggestionClick}
            position={{
              top: textareaRef.current?.getBoundingClientRect().bottom ?? 0,
              left: textareaRef.current?.getBoundingClientRect().left ?? 0
            }}
          />
        )}
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            취소
          </Button>
        )}
        <Button
          type="submit"
          disabled={!content.trim()}
        >
          등록
        </Button>
      </div>
    </form>
  );
};

export default CommentArea; 