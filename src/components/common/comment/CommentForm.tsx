'use client';

import { useState, useRef, useEffect } from 'react';
import { UserDataResponse } from '@/lib/types/user';
import MentionSuggestions from './MentionSuggestions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialContent?: string;
  placeholder?: string;
  existingNicknames: string[];
}

interface MentionSuggestion {
  nickname: string;
  startPosition: number;
  query: string;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialContent = '',
  placeholder = '댓글을 입력하세요...',
  existingNicknames
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [mentionSuggestion, setMentionSuggestion] = useState<MentionSuggestion | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // 멘션 제안 처리
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\S*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      const startPosition = cursorPosition - (mentionMatch[0].length - 1);
      
      // 닉네임 필터링
      const filteredNicknames = existingNicknames.filter(nickname => 
        nickname.toLowerCase().includes(query)
      );

      if (filteredNicknames.length > 0) {
        setMentionSuggestion({
          nickname: filteredNicknames[0],
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

  const handleMentionSelect = (selectedNickname: string) => {
    if (!mentionSuggestion) return;

    const beforeMention = content.slice(0, mentionSuggestion.startPosition - 1);
    const afterMention = content.slice(
      mentionSuggestion.startPosition + mentionSuggestion.query.length
    );
    
    // 멘션 텍스트 생성 (공백이 포함된 닉네임도 처리)
    const mentionText = `@${selectedNickname}\u200B `;
    const newContent = `${beforeMention}${mentionText}${afterMention}`;
    
    setContent(newContent);
    setMentionSuggestion(null);

    // 포커스 복구 및 커서 위치 설정
    if (textareaRef.current) {
      textareaRef.current.focus();
      const newCursorPosition = mentionSuggestion.startPosition + mentionText.length;
      textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="min-h-[100px] resize-none"
        />
        {mentionSuggestion && (
          <div className="absolute z-10 w-full max-h-40 overflow-auto bg-white border rounded-lg shadow-lg">
            {existingNicknames
              .filter(nickname => 
                nickname.toLowerCase().includes(mentionSuggestion.query.toLowerCase())
              )
              .map((nickname) => (
                <button
                  key={nickname}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMentionSelect(nickname);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50"
                >
                  {nickname}
                </button>
              ))}
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button type="submit" disabled={!content.trim()}>
          등록
        </Button>
      </div>
    </form>
  );
} 