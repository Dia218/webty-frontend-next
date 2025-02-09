export type RecommendationType = 'like' | 'hate';

const API_BASE_URL = 'http://localhost:8080/recommend';

const sendRequest = async (
  id: number,
  type: RecommendationType,
  method: 'POST' | 'DELETE'
) => {
  try {
    const url = `${API_BASE_URL}/${id}?type=${type}`;
    const response = await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Failed to send recommendation request:', error);
    throw error;
  }
};

export const recommendLike = (id: number) => sendRequest(id, 'like', 'POST');
export const recommendHate = (id: number) => sendRequest(id, 'hate', 'POST');
export const removeRecommendLike = (id: number) =>
  sendRequest(id, 'like', 'DELETE');
export const removeRecommendHate = (id: number) =>
  sendRequest(id, 'hate', 'DELETE');

export const getRecommendationStatus = async (id: number) => {
  try {
    const url = `${API_BASE_URL}/${id}/recommendation`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch recommendation status:', error);
    throw error;
  }
};
