import { useAuth } from '../security/useAuth';
import { WebtoonSummaryDto } from '../../types/webtoon/WebtoonSummaryDto';

export function logUserActivity(webtoon: WebtoonSummaryDto) {
  const { isLoggedIn, loginId, nickname } = useAuth();

    if (isLoggedIn && loginId) {
      fetch('http://localhost:8080/logs', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: loginId,
          nickname: nickname,
          webtoonId: webtoon.webtoonId,
          webtoonName: webtoon.webtoonName,
          timestamp: new Date().toISOString(),
        }),
      }).catch((error) => console.error('로그 저장 실패:', error));
    }
}

// 사용자가 검색하거나 조회했을 때 호출
