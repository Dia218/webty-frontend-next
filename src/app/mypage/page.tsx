'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/api/user/user';
import { useProfile } from '@/lib/api/user/userProfile';

const MyPage = () => {
  const { isLoggedIn, nickname, profileImage } = useAuth();
  const { handleNicknameChange, handleProfileImageChange, loading, error } =
    useProfile();

  const [newNickname, setNewNickname] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-semibold">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
      {profileImage && (
        <img
          src={profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-4"
        />
      )}

      <div className="flex flex-col items-center mb-4">
        <p className="text-lg font-medium">닉네임: {nickname}</p>
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          className="border rounded px-2 py-1 mt-2"
          placeholder="새 닉네임 입력"
        />
        <button
          onClick={() => handleNicknameChange(newNickname, setNewNickname)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          닉네임 변경
        </button>
      </div>

      <div className="flex flex-col items-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="mt-2"
        />
        <button
          onClick={() =>
            handleProfileImageChange(selectedFile, setSelectedFile)
          }
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          disabled={loading}
        >
          프로필 이미지 변경
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MyPage;
