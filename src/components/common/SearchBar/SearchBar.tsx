'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  initialType?: string;
  onSearch?: (query: string, type: string) => void;
}

// 임시 자동완성 데이터 (실제로는 API에서 가져와야 함)
const AUTOCOMPLETE_DATA = [
  '아이네',
  '아이유',
  '아이폰',
  '아이패드',
  '아이맥',
  '아이돌',
  '아이언맨',
  '아이스크림',
  '아이스아메리카노',
  '아이템',
];

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '', 
  initialType = 'all',
  onSearch
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setSearchText(initialQuery);
    setSearchType(initialType);
  }, [initialQuery, initialType]);

  useEffect(() => {
    // 검색어가 있을 때만 자동완성 표시
    if (searchText.trim()) {
      // 검색어와 일치하는 자동완성 데이터 필터링
      const filtered = AUTOCOMPLETE_DATA.filter(item => 
        item.toLowerCase().includes(searchText.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [searchText]);

  // 클릭 이벤트 처리 (외부 클릭 시 자동완성 닫기)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      if (onSearch) {
        onSearch(searchText.trim(), searchType);
      } else {
        router.push(`/search?query=${encodeURIComponent(searchText.trim())}&type=${searchType}`);
      }
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 한글 입력 중에는 이벤트 처리하지 않음
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        setSearchText(suggestions[selectedIndex]);
        handleSearch();
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const handleSearchTypeChange = (type: string) => {
    setSearchType(type);
    if (initialQuery && !onSearch) {
      router.push(`/search?query=${encodeURIComponent(initialQuery)}&type=${type}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchText(suggestion);
    if (onSearch) {
      onSearch(suggestion, searchType);
    } else {
      router.push(`/search?query=${encodeURIComponent(suggestion)}&type=${searchType}`);
    }
    setIsFocused(false);
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
            웹툰
          </button>
          <button 
            className={`py-2 ${searchType === 'user' ? 'bg-white font-bold' : 'bg-gray-200'}`}
            onClick={() => handleSearchTypeChange('user')}
          >
            사용자
          </button>
          <button 
            className={`py-2 ${searchType === 'review' ? 'bg-white font-bold' : 'bg-gray-200'}`}
            onClick={() => handleSearchTypeChange('review')}
          >
            리뷰
          </button>
        </div>
        
        {/* 검색창 */}
        <form ref={formRef} className="relative">
          <div className="flex">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              placeholder="검색어를 입력하세요"
              className="flex-1"
              autoComplete="off"
            />
            <Button onClick={handleSearch} className="ml-2">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {/* 자동완성 드롭다운 */}
          {isFocused && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      index === selectedIndex ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;