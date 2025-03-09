'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useSearchSuggestions } from '@/lib/api/search/hooks/useSearchSuggestions';
import PopularSearchTerms from './PopularSearchTerms';

interface SearchBarProps {
  initialQuery?: string;
  initialType?: string;
  onSearch?: (query: string, type: string) => void;
  suggestionsLimit?: number;
  minMatchScore?: number;
  showPopularTerms?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialQuery = '', 
  initialType = 'all',
  onSearch,
  suggestionsLimit = 7,
  minMatchScore = 0.5,
  showPopularTerms = true
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showPopular, setShowPopular] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // 자동완성 API 훅 사용 (개선된 파라미터 적용)
  const { suggestions, isLoading, error } = useSearchSuggestions({
    searchText,
    suggestionType: searchType !== 'all' ? searchType : undefined,
    minMatchScore: minMatchScore,
    limit: suggestionsLimit,
    minLength: 2
  });

  useEffect(() => {
    setSearchText(initialQuery);
    setSearchType(initialType);
  }, [initialQuery, initialType]);

  // 인기 검색어 표시 여부 결정
  useEffect(() => {
    if (isFocused && (!searchText || searchText.length < 2) && showPopularTerms) {
      setShowPopular(true);
    } else {
      setShowPopular(false);
    }
  }, [isFocused, searchText, showPopularTerms]);

  // 선택 인덱스 초기화 (검색어나 자동완성 목록이 변경되면)
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchText, suggestions]);

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

  const handlePopularTermClick = (term: string) => {
    setSearchText(term);
    handleSearch();
  };

  return (
    <div className="bg-gray-100 py-2">
      <div className="max-w-6xl mx-auto">
        {/* 검색창 */}
        <form ref={formRef} className="relative py-2 px-4">
          <div className="flex">
            <div className="relative flex-1">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                placeholder="검색"
                className="py-2 pl-3 pr-10 border border-gray-300 rounded-md"
                autoComplete="off"
              />
              <Button 
                onClick={handleSearch} 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded-md"
              >
                {isLoading ? <Loader2 className="h-5 w-5 text-gray-500 animate-spin" /> : <Search className="h-5 w-5 text-gray-500" />}
              </Button>
            </div>
          </div>
          
          {/* 인기 검색어 표시 */}
          {showPopular && (
            <div className="absolute z-10 w-full left-0 bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
              <PopularSearchTerms 
                onTermClick={handlePopularTermClick} 
                className="bg-white"
                minScore={2}
                limit={7}
                recentDays={7}
                showRank={true}
              />
            </div>
          )}
          
          {/* 자동완성 드롭다운 */}
          {isFocused && !showPopular && (suggestions.length > 0 || isLoading) && (
            <div className="absolute z-10 w-full left-0 bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {isLoading && (
                  <li className="px-4 py-2 text-gray-500 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    자동완성 로딩 중...
                  </li>
                )}
                
                {!isLoading && suggestions.length === 0 && searchText.length >= 2 && (
                  <li className="px-4 py-2 text-gray-500">
                    검색 결과가 없습니다
                  </li>
                )}
                
                {!isLoading && suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      index === selectedIndex ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {/* 검색어와 일치하는 부분 강조 표시 */}
                    {highlightMatchedText(suggestion, searchText)}
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

/**
 * 검색어와 일치하는 부분을 강조 표시하는 함수
 */
const highlightMatchedText = (text: string, query: string): React.ReactNode => {
  if (!query || query.length < 2) return <>{text}</>;
  
  try {
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? 
            <span key={i} className="font-bold text-blue-600">{part}</span> : 
            <span key={i}>{part}</span>
        )}
      </>
    );
  } catch (e) {
    // 정규표현식 오류 등의 예외 상황 처리
    return <>{text}</>;
  }
};

export default SearchBar;