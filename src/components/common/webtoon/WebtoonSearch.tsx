interface WebtoonSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const WebtoonSearch: React.FC<WebtoonSearchProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <input
      type="text"
      placeholder="웹툰 이름 검색"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border p-2 w-full mb-4"
    />
  );
};

export default WebtoonSearch;
