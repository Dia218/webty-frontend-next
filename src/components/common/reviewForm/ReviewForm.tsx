'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReviewDialog from '@/components/common/ReviewDialog/ReviewDialog';
import InputAlert from '@/components/common/ReviewDialog/InputAlertDialog';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  mode: 'write' | 'edit'; // 작성 or 수정 모드 구분
  webtoonName: string;
  webtoonId: number;
  initialTitle?: string; // 기존 제목 (수정 시 필요)
  initialContent?: string; // 기존 내용 (수정 시 필요)
  initialImages?: File[]; // 기존 업로드된 이미지 (수정 시 필요)
  onSubmit: (
    title: string,
    content: string,
    spoilerStatus: boolean,
    images: File[]
  ) => Promise<number | null>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  mode,
  webtoonName,
  webtoonId,
  initialTitle = '',
  initialContent = '',
  initialImages = [],
  onSubmit,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [spoilerStatus, setSpoilerStatus] = useState(false);
  const [images, setImages] = useState<File[]>(initialImages);
  const router = useRouter();

  // 다이얼로그 상태
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDescription, setAlertDescription] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(
    null
  );
  const [inputAlertOpen, setInputAlertOpen] = useState(false);
  const [inputAlertMessage, setInputAlertMessage] = useState('');

  // 수정 모드일 경우 기존 데이터를 상태에 반영
  useEffect(() => {
    if (mode == 'edit') {
      setTitle(initialTitle);
      setContent(initialContent);
      setImages(initialImages);
    }
  }, [initialTitle, initialContent, initialImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setInputAlertMessage('제목을 입력해주세요.');
      setInputAlertOpen(true);
      return;
    }

    if (!content.trim()) {
      setInputAlertMessage('내용을 입력해주세요.');
      setInputAlertOpen(true);
      return;
    }

    const reviewId = await onSubmit(title, content, spoilerStatus, images);

    if (reviewId) {
      setAlertTitle(mode === 'write' ? '리뷰 작성 완료' : '리뷰 수정 완료');
      setAlertDescription(
        mode === 'write'
          ? '리뷰가 성공적으로 작성되었습니다!'
          : '리뷰가 성공적으로 수정되었습니다!'
      );
      setOnConfirmAction(() => () => {
        router.push(`/review-detail/${reviewId}`); // reviewDetail 화면
      });
    } else {
      setAlertTitle(mode === 'write' ? '리뷰 작성 실패' : '리뷰 수정 실패');
      setAlertDescription(
        mode === 'write'
          ? '리뷰 작성에 실패했습니다.'
          : '리뷰 수정에 실패했습니다.'
      );
      setOnConfirmAction(null);
    }
    setAlertOpen(true);
  };

  return (
    <Card className="w-full max-w-[90vw] max-h-[95vh] overflow-y-auto p-10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          <span className="text-4xl">"{webtoonName}" </span>{' '}
          {mode === 'write' ? '리뷰 작성' : '리뷰 수정'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8">
          {/* 제목 입력 */}
          <div>
            <Label htmlFor="title" className="text-lg mb-2 block">
              제목
            </Label>
            <Input
              id="title"
              placeholder="리뷰 제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              style={{ fontSize: '1.14rem' }}
            />
          </div>

          {/* 내용 입력 */}
          <div>
            <Label htmlFor="content" className="text-lg mb-2 block">
              내용
            </Label>
            <Textarea
              id="content"
              placeholder="리뷰 내용을 입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={11}
              className="w-full"
            />
          </div>

          {/* 스포일러 여부 */}
          <div className="flex items-center gap-4">
            <Label htmlFor="spoilerStatus" className="text-lg">
              스포일러 여부
            </Label>
            <Switch
              id="spoilerStatus"
              checked={spoilerStatus}
              onCheckedChange={setSpoilerStatus}
            />
          </div>
          {/* 파일 업로드 */}
          <div>
            <Label htmlFor="images" className="text-lg mb-2 block">
              이미지 업로드
            </Label>
            <div className="flex items-center gap-4">
              {/* 파일 선택 버튼 */}
              <Button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => document.getElementById('images')?.click()}
              >
                파일 선택
              </Button>

              {/* 파일 리스트 */}
              <div className="flex flex-col gap-1 w-full">
                {images.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {images.length}개의 파일이 선택되었습니다.
                  </span>
                )}
                <div className="flex flex-wrap gap-2">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded"
                    >
                      <span className="truncate text-sm text-gray-700">
                        {file.name.length > 20
                          ? `${file.name.slice(0, 20)}...`
                          : file.name}
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 숨겨진 파일 선택 Input */}
            <Input
              id="images"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleSubmit} className="px-6 py-2 text-lg">
            {mode === 'write' ? '리뷰 작성' : '리뷰 수정'}
          </Button>
        </div>
      </CardContent>

      {/* 다이얼로그 */}
      <InputAlert
        isOpen={inputAlertOpen}
        onClose={() => setInputAlertOpen(false)}
        message={inputAlertMessage}
      />
      <ReviewDialog
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        description={alertDescription}
        onConfirm={onConfirmAction}
      />
    </Card>
  );
};

export default ReviewForm;
