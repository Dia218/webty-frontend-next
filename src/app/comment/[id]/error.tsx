'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('댓글 페이지 에러:', error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[400px] flex-col items-center justify-center p-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          페이지를 불러오는 중 오류가 발생했습니다
        </h2>
        <p className="mb-4 text-gray-600">
          {error.message || '알 수 없는 오류가 발생했습니다.'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => window.location.href = '/feed'}
            variant="outline"
          >
            피드로 돌아가기
          </Button>
          <Button
            onClick={() => reset()}
            variant="default"
          >
            다시 시도
          </Button>
        </div>
      </div>
    </div>
  );
}
