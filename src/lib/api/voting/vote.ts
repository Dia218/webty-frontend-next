import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:8080/vote';

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
      `${API_BASE_URL}/vote/${similarId}`,
      null, // POST 요청 바디는 없으므로 null 처리
      {
        params: { voteType, page, size },
        withCredentials: true,
      }
    );
    console.log(`✅ 투표 성공: similarId=${similarId}, voteType=${voteType}`);
  } catch (error) {
    console.error('❌ 투표 요청 실패:', error);
  }
};

// 특정 similarId에 대한 투표 취소 요청
export const cancelVote = async (
  similarId: number,
  page: number = 0,
  size: number = 10
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/vote/${similarId}`, {
      params: { page, size },
      withCredentials: true,
    });
    console.log(`✅ 투표 취소 성공: similarId=${similarId}`);
  } catch (error) {
    console.error('❌ 투표 취소 요청 실패:', error);
  }
};
