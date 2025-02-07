import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/api/user/user';
import { TestModeConfig } from '@/lib/types/test/comment';

export function useTestMode(isTestMode: boolean = false): TestModeConfig {
  const { isLoggedIn, nickname } = useAuth();
  const [currentNickname, setCurrentNickname] = useState<string>('테스트 사용자');

  useEffect(() => {
    // 로그인된 사용자가 있으면 해당 닉네임을 사용
    if (isLoggedIn && nickname) {
      setCurrentNickname(nickname);
    } else if (isTestMode) {
      setCurrentNickname('테스트 사용자');
    }
  }, [isTestMode, isLoggedIn, nickname]);

  return {
    isTestMode,
    currentNickname,
    isLoggedIn
  };
} 