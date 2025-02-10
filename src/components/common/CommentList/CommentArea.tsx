'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { MentionSuggestions } from './MentionSuggestions';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';

export interface CommentAreaProps {
  onSubmit?: (commentRequestDto: CommentRequestDto) => Promise<void>
  onCancel?: () => void;
  initialContent?: string;
  placeholder?: string;
  existingUsers?: UserDataResponseDto[];
  reviewId?: number;
  parentCommentId?: number;
  isThreadView?: boolean;
}

interface MentionSuggestion {
  users: UserDataResponseDto[];
  startPosition: number;
  query: string;
}

const CommentArea = ({
  onSubmit,
  onCancel,
  initialContent = '',
  placeholder = '댓글을 입력하세요...',
  existingUsers = [],
  reviewId,
  parentCommentId,
  isThreadView = false
}: CommentAreaProps) => {
  const [content, setContent] = useState(initialContent);
  const [mentionSuggestion, setMentionSuggestion] = useState<MentionSuggestion | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      if (onSubmit) {
        const commentRequestDto: CommentRequestDto = {
          content: content.trim(),
          parentCommentId: parentCommentId ?? 0,
          mentions: extractMentions(content)
        };
        await onSubmit(commentRequestDto);
      }
      setContent('');
      setMentionSuggestion(null);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentions = text.match(/@(\S+)/g) || [];
    return mentions.map(mention => mention.slice(1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // 현재 입력 상태를 CommentRequestDto 형식으로 관리
    const currentComment: CommentRequestDto = {
      content: newContent,
      parentCommentId: parentCommentId ?? 0,
      mentions: extractMentions(newContent)
    };

    // 멘션 제안 처리
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\S*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      const startPosition = cursorPosition - (mentionMatch[0].length - 1);
      
      // 현재 입력된 멘션을 제외한 사용자 목록 필터링
      const currentMentions = new Set(currentComment.mentions);
      const filteredUsers = existingUsers.filter(user => 
        user.nickname.toLowerCase().includes(query) && 
        !currentMentions.has(user.nickname)
      );

      if (filteredUsers.length > 0) {
        setMentionSuggestion({
          users: filteredUsers,
          startPosition,
          query
        });
      } else {
        setMentionSuggestion(null);
      }
    } else {
      setMentionSuggestion(null);
    }
  };

  const handleSuggestionClick = (user: UserDataResponseDto) => {
    if (!mentionSuggestion) return;

    const beforeMention = content.slice(0, mentionSuggestion.startPosition - 1);
    const afterMention = content.slice(
      mentionSuggestion.startPosition + mentionSuggestion.query.length
    );
    
    // 멘션 텍스트 생성 (제로 위드 스페이스로 멘션 구분)
    const mentionText = `@${user.nickname}\u200B `;
    const newContent = `${beforeMention}${mentionText}${afterMention}`;
    
    // 새로운 content를 CommentRequestDto 형식으로 업데이트
    setContent(newContent);
    setMentionSuggestion(null);

    if (textareaRef.current) {
      textareaRef.current.focus();
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
        {mentionSuggestion && mentionSuggestion.users.length > 0 && (
          <MentionSuggestions
            users={mentionSuggestion.users}
            onSelect={handleSuggestionClick}
            position={{
              top: textareaRef.current?.getBoundingClientRect().bottom ?? 0,
              left: textareaRef.current?.getBoundingClientRect().left ?? 0
            }}
          />
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={!content.trim()}
        >
          등록
        </Button>
        {onCancel && (
          <Button
            type="reset"
            onClick={onCancel}
          >
            취소
          </Button>
        )}
      </div>
    </form>
  );
};

export default CommentArea; 