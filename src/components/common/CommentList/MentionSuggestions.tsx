import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MentionSuggestionsProps {
  users: UserDataResponseDto[];
  onSelect: (user: UserDataResponseDto) => void;
  position: { top: number; left: number };
}

export function MentionSuggestions({
  users,
  onSelect,
  position,
}: MentionSuggestionsProps) {
  if (users.length === 0) return null;

  return (
    <div
      className="absolute z-50 max-h-40 w-64 overflow-auto rounded-lg border bg-white shadow-lg"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {users.map((user) => (
        <button
          key={user.id}
          className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
          onClick={() => onSelect(user)}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.profileImage} alt={user.nickname} />
            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
          </Avatar>
          <span>{user.nickname}</span>
        </button>
      ))}
    </div>
  );
}