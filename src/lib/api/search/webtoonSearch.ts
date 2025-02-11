export const fetchWebtoons = async (
  page: number,
  params: Record<string, any>
) => {
  if (!params.webtoonName) return null; // 빈 검색어 방지

  const query = new URLSearchParams({
    ...params,
    page: page.toString(),
    size: '10',
  }).toString();

  try {
    const response = await fetch(`http://localhost:8080/webtoons?${query}`);
    if (!response.ok) {
      throw new Error('웹툰 데이터를 불러오는 중 오류 발생');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
