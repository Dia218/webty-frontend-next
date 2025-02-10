export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      {/* 헤더 스켈레톤 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        {/* 리뷰 내용 스켈레톤 */}
        <div className="mb-6 rounded bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
              <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* 댓글 작성 영역 스켈레톤 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
            <div className="h-10 flex-1 animate-pulse rounded bg-gray-100" />
            <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* 댓글 목록 스켈레톤 */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg bg-gray-100 p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-300" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-300" />
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
