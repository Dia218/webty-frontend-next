import axios from 'axios';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

// API 호출 함수
export const fetchWebtoonById = async (
  id: string
): Promise<WebtoonDetailDto> => {
  try {
    const response = await axios.get<WebtoonDetailDto>(
      `http://localhost:8080/webtoons/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('웹툰 데이터 호출에 실패했습니다.', error);
    throw error;
  }
};
