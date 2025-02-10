import { useState, useEffect } from 'react';
import axios from 'axios';

const socialLoginForKaKaoUrl = `http://localhost:8080/oauth2/authorization/kakao`;
const redirectUrlAfterSocialLogin = 'http://localhost:3000';
const socialLogoutUrl = `http://localhost:8080/logout`;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/info', {
        withCredentials: true
      });
      setIsLoggedIn(true);
      return response.data;
    } catch (error) {
      setIsLoggedIn(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = (): void => {
    const currentUrl = window.location.href;
    localStorage.setItem('lastVisitedPage', currentUrl);
    window.location.href = socialLoginForKaKaoUrl;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await axios.get(socialLogoutUrl, {
        withCredentials: true
      });
      setIsLoggedIn(false);
      window.location.href = redirectUrlAfterSocialLogin;
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return { isLoggedIn, isLoading, handleLogin, handleLogout, checkLoginStatus };
};
