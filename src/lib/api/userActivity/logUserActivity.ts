
import { WebtoonSummaryDto } from '../../types/webtoon/WebtoonSummaryDto';

export const logUserActivity=(userId: number, webtoon: WebtoonSummaryDto)=> {

    fetch('http://localhost:8080/activity/logs', {  
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      webtoonId: webtoon.webtoonId,
      webtoonName: webtoon.webtoonName
    }),
  }).catch((error) => console.error('로그 저장 실패:', error));
}

// 웹툰 검색 함수
export const recommendWebtoons = async (userId: number): Promise<string[]> => {
  try {
    const response = await fetch(`http://localhost:8080/activity/webtoon/recommend/${userId}`, {  
      method: 'GET',
      credentials: 'include', // 인증 쿠키를 함께 전송
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }
    const webtoonIds: string[] = await response.json(); // 응답을 JSON으로 변환
    return webtoonIds;
  } catch (error) {
    console.error('API 요청 실패: 추천 웹툰 조회 실패:', error);
    return [];
  }
}