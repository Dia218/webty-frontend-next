import { useState, useEffect } from 'react';

const socialLoginForKaKaoUrl = `http://localhost:8080/oauth2/authorization/kakao`;
const redirectUrlAfterSocialLogin = 'http://localhost:3000';
const socialLogoutUrl = `http://localhost:8080/logout`;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/user/info', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Not logged in');
      })
      .then(() => {
        setIsLoggedIn(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogin = (): void => {
    const currentUrl = window.location.href;
    localStorage.setItem('lastVisitedPage', currentUrl);
    window.location.href = socialLoginForKaKaoUrl;
  };

  const handleLogout = (): void => {
    fetch(socialLogoutUrl, {
      method: 'GET',
      credentials: 'include',
    })
      .then(() => {
        setIsLoggedIn(false);
        window.location.href = redirectUrlAfterSocialLogin;
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return { isLoggedIn, handleLogin, handleLogout };
};
