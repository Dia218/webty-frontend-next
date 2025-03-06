import { WebtoonDetailDto } from "@/lib/types/webtoon/WebtoonDetailDto";
import RecommendWebtoonItem from "./RecommendWebtoonItem";

interface RecommendWebtoonListProps {
    webtoons: WebtoonDetailDto[];
    isLoggedIn: boolean;
}
import { useRef, useState, useEffect } from "react";

const RecommendWebtoonList: React.FC<RecommendWebtoonListProps> = ({
    webtoons , isLoggedIn
  }) => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollRight, setCanScrollRight] = useState(true); // 오른쪽으로 스크롤할 수 있는지 여부
    const [canScrollLeft, setCanScrollLeft] = useState(false); // 왼쪽으로 스크롤할 수 있는지 여부
    const [showButtons, setShowButtons] = useState(isLoggedIn); // 버튼 표시 상태
  
    const scrollRight = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    };
  
    const scrollLeft = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
      }
    };
  
    const checkScrollPosition = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // 스크롤이 끝에 다가가면 오른쪽 버튼 비활성화
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        // 스크롤이 제일 왼쪽에 오면 왼쪽 버튼 비활성화
        setCanScrollLeft(scrollLeft > 0);
      }
    };
  
    useEffect(() => {
        // 로그인 상태가 변경될 때 버튼의 표시 여부 업데이트
        setShowButtons(isLoggedIn);
      }, [isLoggedIn]); // isLoggedIn 상태 변경시마다 실행

    useEffect(() => {
      // 스크롤 이벤트가 발생할 때마다 스크롤 상태 확인
      const handleScroll = () => checkScrollPosition();
      const container = scrollRef.current;
  
      if (container) {
        container.addEventListener("scroll", handleScroll);
      }
  
      // cleanup
      return () => {
        if (container) {
          container.removeEventListener("scroll", handleScroll);
        }
      };
    }, []);
  
    return (
        <div className="relative">
            {/* 웹툰 리스트 (가로 스크롤) */}
            <div
                ref={scrollRef}
                className="flex overflow-x-hidden scroll-smooth whitespace-nowrap space-x-4 p-4"
            >
                {webtoons.map((webtoon) => (
                <RecommendWebtoonItem key={webtoon.webtoonId} webtoon={webtoon} />
                ))}
            </div>

            {/* 로그인된 상태에서만 버튼 보이기 */}
            {showButtons && (
                <>
                {/* 왼쪽 이동 버튼 */}
                <button
                    onClick={scrollLeft}
                    className={`absolute  top-1/2 left-2 transform -translate-y-1/2 
                                  bg-transparent text-2xl
                                  shadow-md ${canScrollLeft ? '' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!canScrollLeft}
                >
                 &lt;
                </button>

                {/* 오른쪽 이동 버튼 */}
                <button
                    onClick={scrollRight}
                    className={`absolute top-1/2 right-2  transform -translate-y-1/2 
                                 bg-transparent text-2xl 
                                 shadow-md ${canScrollRight ? '' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!canScrollRight}
                >
                  &gt;
                </button>
                </>
            )}
            </div>
    );
  };
  
  export default  RecommendWebtoonList;
  