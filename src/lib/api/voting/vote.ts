import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/vote';

// 특정 similarId에 대한 투표 요청
// voteType = "AGREE" or "DISAGREE"
export const vote = async (
  similarId: number,
  voteType: string,
  page: number = 0,
  size: number = 10
): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/${similarId}`,
      null, // POST 요청 바디는 없으므로 null 처리
      {
        params: { voteType, page, size },
        withCredentials: true,
      }
    );
    console.log(`✅ 투표 성공: similarId=${similarId}, voteType=${voteType}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('❌ 투표 요청 실패:', {
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.warn('❌ 예상치 못한 오류:', error);
    }
    throw error; // catch에서 다시 throw하면 프론트에서 alert 처리 가능
  }
};

// 특정 similarId에 대한 투표 취소 요청
export const cancelVote = async (
  similarId: number,
  page: number = 0,
  size: number = 10
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${similarId}`, {
      params: { page, size },
      withCredentials: true,
    });
    console.log(`✅ 투표 취소 성공: similarId=${similarId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.warn('❌ 투표 요청 실패:', {
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.warn('❌ 예상치 못한 오류:', error);
    }
    throw error; // catch에서 다시 throw하면 프론트에서 alert 처리 가능
  }
};
