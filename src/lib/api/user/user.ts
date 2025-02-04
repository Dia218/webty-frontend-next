import { useState, useEffect } from "react";

const socialLoginForKaKaoUrl = `http://localhost:8080/oauth2/authorization/kakao`;
const redirectUrlAfterSocialLogin = "http://localhost:3000";
const socialLogoutUrl = `http://localhost:8080/logout`;

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/user/info", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        }
        throw new Error("Not logged in");
      })
      .then((username) => {
        setIsLoggedIn(true);
        setUsername(username);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUsername(null);
      });
  }, []);

  const handleLogin = (): void => {
    window.location.href = `${socialLoginForKaKaoUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`;
  };

  const handleLogout = (): void => {
    fetch(socialLogoutUrl, {
      method: "GET",
      credentials: "include",
    })
      .then(() => {
        setIsLoggedIn(false);
        window.location.href = redirectUrlAfterSocialLogin;
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return { isLoggedIn, username, handleLogin, handleLogout };
};
