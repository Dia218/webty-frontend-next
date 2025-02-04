import axios from 'axios';

export interface FavoriteDto {
  webtoonId: string;
}

export const addFavoriteWebtoon = async (webtoonId: string) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/favorite/${webtoonId}`,
      {}, // 빈 객체를 request body로 전달 (POST 요청이므로 필요)
      {
        withCredentials: true, // 쿠키 인증 추가
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('Failed to add favorite webtoon:', error);
    return false;
  }
};

export const checkFavoriteWebtoon = async (webtoonId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/favorite/${webtoonId}`,
      {
        withCredentials: true, // 쿠키 인증 추가
      }
    );
    return response.data;
  } catch (error) {
    console.error('관심 웹툰 여부 확인 실패:', error);
    return false;
  }
};

export const deleteFavoriteWebtoon = async (webtoonId: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/favorite/${webtoonId}`,
      {
        withCredentials: true,
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('관심 웹툰 여부 확인 실패:', error);
    return false;
  }
};
