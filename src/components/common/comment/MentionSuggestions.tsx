'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserDataResponse } from '@/lib/types/user';

interface MentionSuggestionsProps {
  suggestions: UserDataResponse[];
  onSelect: (user: UserDataResponse) => void;
  position: { top: number; left: number };
}

export default function MentionSuggestions({
  suggestions,
  onSelect,
  position,
}: MentionSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div
      className="absolute z-50 max-h-40 w-64 overflow-auto rounded-lg border bg-white shadow-lg"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {suggestions.map((user) => (
        <button
          key={user.userId}
          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-blue-50"
          onClick={(e) => {
            e.preventDefault();
            onSelect(user);
          }}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={user.profileImageUrl || "/default-profile.png"} 
              alt={user.nickname} 
            />
            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
          </Avatar>
          <span>{user.nickname}</span>
        </button>
      ))}
    </div>
  );
} 