'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/api/user/user';
import { useProfile } from '@/lib/api/user/userProfile';

const MyPage = () => {
  const { isLoggedIn, nickname, profileImage } = useAuth();
  const { changeNickname, changeProfileImage, loading, error } = useProfile();

  const [newNickname, setNewNickname] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-semibold">로그인이 필요합니다.</p>
      </div>
    );
  }

  // 닉네임 변경 핸들러
  const handleNicknameChange = async () => {
    if (newNickname.trim() === '') return alert('닉네임을 입력하세요.');
    const result = await changeNickname(newNickname);
    if (result) {
      setNewNickname('');
      alert('닉네임이 변경되었습니다.');
      window.location.reload(); // 변경된 값 반영을 위해 새로고침
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = async () => {
    if (!selectedFile) return alert('이미지를 선택하세요.');
    await changeProfileImage(selectedFile);
    setSelectedFile(null);
    alert('프로필 이미지가 변경되었습니다.');
    window.location.reload(); // 변경된 값 반영을 위해 새로고침
  };

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

      {/* 닉네임 변경 */}
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
          onClick={handleNicknameChange}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          닉네임 변경
        </button>
      </div>

      {/* 프로필 이미지 변경 */}
      <div className="flex flex-col items-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="mt-2"
        />
        <button
          onClick={handleProfileImageChange}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          disabled={loading}
        >
          프로필 이미지 변경
        </button>
      </div>

      {/* 오류 메시지 */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default MyPage;
