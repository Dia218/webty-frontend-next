'use client';

import { useState, useRef, useEffect } from 'react';
import MentionSuggestions from './MentionSuggestions';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  isReply?: boolean;
  existingNicknames: string[];
  isTestMode?: boolean;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = '댓글을 입력하세요...',
  isReply = false,
  existingNicknames,
  isTestMode = false,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [mentionSuggestions, setMentionSuggestions] = useState<string[]>([]);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mentionStartIndex, setMentionStartIndex] = useState<number>(-1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // 멘션 제안 처리
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newContent.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    if (lastAtSymbol !== -1 && lastAtSymbol === mentionStartIndex) {
      const searchText = textBeforeCursor.slice(lastAtSymbol + 1);
      // 현재 단어만 검색어로 사용
      const currentWord = searchText.split(/[\s@]/)[0];
      
      if (currentWord) {
        const suggestions = existingNicknames.filter(nickname =>
          nickname.toLowerCase().includes(currentWord.toLowerCase())
        );

        if (suggestions.length > 0 && textareaRef.current) {
          const textareaRect = textareaRef.current.getBoundingClientRect();
          setMentionPosition({
            top: textareaRect.top + window.scrollY,
            left: textareaRect.left,
          });
          setMentionSuggestions(suggestions);
        } else {
          setMentionSuggestions([]);
        }
      }
    } else if (newContent.endsWith('@')) {
      setMentionStartIndex(newContent.length - 1);
      setMentionSuggestions(existingNicknames);
      if (textareaRef.current) {
        const textareaRect = textareaRef.current.getBoundingClientRect();
        setMentionPosition({
          top: textareaRect.top + window.scrollY,
          left: textareaRect.left,
        });
      }
    } else {
      setMentionSuggestions([]);
      setMentionStartIndex(-1);
    }
  };

  const handleMentionSelect = (nickname: string) => {
    if (mentionStartIndex !== -1) {
      const beforeMention = content.slice(0, mentionStartIndex);
      const currentPosition = textareaRef.current?.selectionStart || content.length;
      const afterMention = content.slice(currentPosition);
      
      // 현재 입력 중인 멘션 텍스트를 제거하고 선택된 닉네임으로 교체
      const newContent = `${beforeMention}@${nickname} ${afterMention}`;
      setContent(newContent);
      setMentionSuggestions([]);
      setMentionStartIndex(-1);
      
      // 포커스를 멘션 뒤로 이동
      if (textareaRef.current) {
        const newCursorPosition = mentionStartIndex + nickname.length + 2; // @ + nickname + space
        setTimeout(() => {
          textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
          textareaRef.current?.focus();
        }, 0);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${isReply ? 'ml-8' : ''} relative`}>
      <div className="rounded-lg bg-gray-50 p-4">
        <MentionSuggestions
          suggestions={mentionSuggestions}
          onSelect={handleMentionSelect}
          position={mentionPosition}
          isTestMode={isTestMode}
        />
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="mb-2 w-full rounded-lg border p-2 text-sm"
          rows={3}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim()}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
          >
            작성
          </button>
        </div>
      </div>
    </form>
  );
} 