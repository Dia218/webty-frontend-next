import { useState } from 'react';

const BASE_URL = 'http://localhost:8080/user';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 닉네임 변경 함수
  const changeNickname = async (newNickname: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/nickname`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ nickname: newNickname }),
      });
      if (!response.ok) throw new Error('닉네임 변경 실패');
      return await response.json();
    } catch (err) {
      setError('닉네임 변경 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 프로필 이미지 변경 함수
  const changeProfileImage = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BASE_URL}/profileImage`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('프로필 이미지 변경 실패');

      return await response.json();
    } catch (err) {
      setError('프로필 이미지 변경 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { changeNickname, changeProfileImage, loading, error };
};
