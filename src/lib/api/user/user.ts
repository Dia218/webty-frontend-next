interface User {
    nickname: string;
    profileImage: string;
  }
  
  // 쿠키에서 특정 이름의 값을 가져오는 함수
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };
  
  export const getUserData = async (): Promise<User> => {
    // 쿠키에서 액세스 토큰과 리프레시 토큰 가져오기
    let accessToken = getCookie('accessToken');
    let refreshToken = getCookie('refreshToken');
  
    // 쿠키에 토큰이 없으면 로컬 스토리지에서 확인
    if (!accessToken) {
      accessToken = localStorage.getItem('accessToken');
    }
    if (!refreshToken) {
      refreshToken = localStorage.getItem('refreshToken');
    }
  
    if (!accessToken || !refreshToken) {
      throw new Error('No tokens available');
    }
  
    const response = await fetch('http://localhost:8080/user/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': refreshToken,
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
    }
  
    const data: User = await response.json();
    return data;
  };