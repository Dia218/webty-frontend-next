'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/api/user/user';
import { useProfile } from '@/lib/api/user/userProfile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

const MyPage = () => {
  const { isLoggedIn, nickname, profileImage } = useAuth();
  const { handleNicknameChange, handleProfileImageChange, loading, error } =
    useProfile();

  const [newNickname, setNewNickname] = useState(nickname || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 닉네임 수정 버튼 클릭 시
  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0); // 포커스 이동
  };

  // 닉네임 변경 핸들러
  const handleSaveNickname = () => {
    if (newNickname.trim() === '') return alert('닉네임을 입력하세요.');
    handleNicknameChange(newNickname, setNewNickname);
    setIsEditing(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-semibold">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start min-h-screen p-8">
      {/* 타이틀 */}
      <h1 className="text-3xl font-bold mb-4">
        My Page <span className="text-gray-600">(내 정보)</span>
      </h1>
      <hr className="w-full border-gray-300 mb-6" />

      {/* 프로필 정보 */}
      <div className="flex items-center gap-6">
        {/* 프로필 이미지 */}
        <div className="relative">
          <img
            src={profileImage!}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <Button
            variant="outline"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs px-1 py-1"
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            수정
          </Button>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* 닉네임 & 수정 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <p className="text-lg font-medium mr-4">닉네임: {nickname}</p>
                <Button variant="ghost" size="icon" onClick={handleEditClick}>
                  <Pencil size={16} />
                  <span>수정</span>
                </Button>
              </>
            ) : (
              <>
                <Input
                  ref={inputRef}
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <Button
                  onClick={handleSaveNickname}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  저장
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 오류 메시지 */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default MyPage;
