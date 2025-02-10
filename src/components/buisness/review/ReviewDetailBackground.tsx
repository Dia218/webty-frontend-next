import React from 'react';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';

interface ReviewDetailBackgroundProps {
  data: ReviewDetailResponseDto;
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
  },
  backgroundLayer: {
    position: 'absolute',
    top: '15vh',
    left: '5vw',
    right: '5vw',
    bottom: '5vh',
    backgroundColor: '#D1D5DB',
    borderRadius: '16px',
  },
  smallBox: {
    position: 'absolute',
    width: '16.66%', // 기존 네모의 1/6
    height: '33.33%', // 기존 네모의 1/3
    backgroundColor: '#9CA3AF', // 더 진한 회색
    top: '50%',
    right: '13%',
    transform: 'translateY(-50%)', // 세로 중앙 정렬
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    height: '100%',
  },
} as const;

const ReviewDetailBackground: React.FC<ReviewDetailBackgroundProps> = ({ data }) => {
  return (
    <div style={styles.container}>
      {/* 배경 레이어 */}
      <div style={styles.backgroundLayer} />

      {/* 작은 네모 */}
      <div style={styles.smallBox} />

      {/* 콘텐츠를 위한 wrapper */}
      <div style={styles.contentWrapper}>
        {/* 여기에 추가 콘텐츠가 들어갈 수 있습니다 */}
      </div>
    </div>
  );
};

export default ReviewDetailBackground;
