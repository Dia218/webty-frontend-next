'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  initialType?: string;
  onSearch?: (query: string, type: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '', 
  initialType = 'all',
  onSearch
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);

  useEffect(() => {
    setSearchText(initialQuery);
    setSearchType(initialType);
  }, [initialQuery, initialType]);

  const handleSearch = () => {
    if (searchText.trim()) {
      if (onSearch) {
        onSearch(searchText.trim(), searchType);
      } else {
        router.push(`/search?query=${encodeURIComponent(searchText.trim())}&type=${searchType}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchTypeChange = (type: string) => {
    setSearchType(type);
    if (initialQuery && !onSearch) {
      router.push(`/search?query=${encodeURIComponent(initialQuery)}&type=${type}`);
    }
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 검색 탭 */}
        <div className="grid grid-cols-4 mb-4">
          <button 
            className={`py-2 ${searchType === 'all' ? 'bg-white font-bold' : 'bg-gray-200'}`}
            onClick={() => handleSearchTypeChange('all')}
          >
            전체
          </button>
          <button 
            className={`py-2 ${searchType === 'webtoon' ? 'bg-white font-bold' : 'bg-gray-200'}`}
            onClick={() => handleSearchTypeChange('webtoon')}
          >
            웹툰이름
          </button>
          <button 
            className={`py-2 ${searchType === 'user' ? 'bg-white font-bold' : 'bg-gray-200'}`}
            onClick={() => handleSearchTypeChange('user')}
          >
            닉네임
          </button>
          <button 
            className={`py-2 ${searchType === 'review' ? 'bg-white font-bold' : 'bg-gray-200'}`}
            onClick={() => handleSearchTypeChange('review')}
          >
            리뷰내용 및 제목
          </button>
        </div>
        
        {/* 검색창 */}
        <div className="flex">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="검색어를 입력하세요"
            className="flex-1"
          />
          <Button onClick={handleSearch} className="ml-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 