'use client'; // Next.js에서 클라이언트 컴포넌트로 설정

// 필요한 기능들을 가져오기
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/comment-avatar'; // 프로필 이미지 표시용 컴포넌트들
import { UserDataResponse } from '@/lib/types/user'; // 사용자 데이터 타입 정의

// 이 컴포넌트가 받을 속성들 정의
interface MentionSuggestionsProps {
  suggestions: UserDataResponse[]; // 멘션 제안할 사용자 목록
  onSelect: (user: UserDataResponse) => void; // 사용자가 멘션을 선택했을 때 실행할 함수
  position: { 
    top: number; // 멘션 제안 목록을 표시할 세로 위치
    left: number; // 멘션 제안 목록을 표시할 가로 위치
  };
}

// MentionSuggestions 컴포넌트 정의
export default function MentionSuggestions({
  suggestions, // 멘션 제안 목록
  onSelect, // 선택 처리 함수
  position, // 표시 위치
}: MentionSuggestionsProps) {
  // 제안할 사용자가 없으면 아무것도 표시하지 않음
  if (suggestions.length === 0) return null;

  // 멘션 제안 목록 UI 표시
  return (
    <div
      className="absolute z-50 max-h-40 w-64 overflow-auto rounded-lg border bg-white shadow-lg" // 스타일 설정
      style={{
        top: position.top, // 세로 위치 설정
        left: position.left, // 가로 위치 설정
      }}
    >
      {/* 각 사용자를 버튼으로 표시 */}
      {suggestions.map((user) => (
        <button
          key={user.userId} // React가 각 항목을 구분하기 위한 고유 키
          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-blue-50" // 버튼 스타일
          onClick={(e) => {
            e.preventDefault(); // 기본 버튼 동작 방지
            onSelect(user); // 사용자 선택 처리
          }}
        >
          {/* 사용자 프로필 이미지 */}
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={user.profileImageUrl || "/default-profile.png"} // 프로필 이미지 또는 기본 이미지
              alt={user.nickname} // 접근성을 위한 대체 텍스트
            />
            {/* 프로필 이미지가 없을 때 표시할 대체 내용 */}
            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
          </Avatar>
          {/* 사용자 닉네임 */}
          <span>{user.nickname}</span>
        </button>
      ))}
    </div>
  );
}