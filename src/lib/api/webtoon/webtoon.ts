import axios from 'axios';

export interface WebtoonDTO {
  webtoonId: string;
  webtoonName: string;
  platform: string;
  webtoonLink: string;
  thumbnailUrl: string;
  authors: string;
  finished: boolean;
}

// API 호출 함수
export const fetchWebtoonById = async (id: string): Promise<WebtoonDTO> => {
  try {
    const response = await axios.get<WebtoonDTO>(
      `http://localhost:8080/webtoons/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('웹툰 데이터 호출에 실패했습니다.', error);
    throw error;
  }
};
