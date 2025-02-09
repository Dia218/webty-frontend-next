import React, { useState, useEffect } from 'react';

interface ButtonProps {
  isInitialActive?: boolean;
  isLoggedIn: boolean;
  onActivate: () => void; // 활성화 시 실행할 함수
  onDeactivate: () => void; // 비활성화 시 실행할 함수
}

export const LikeButton: React.FC<ButtonProps> = ({
  isInitialActive = false,
  isLoggedIn,
  onActivate,
  onDeactivate,
}) => {
  const [isActive, setIsActive] = useState(isInitialActive);

  useEffect(() => {
    setIsActive(isInitialActive);
  }, [isInitialActive]);

  const handleClick = async () => {
    if (!isLoggedIn) return;

    setIsActive((prev) => !prev);

    if (isActive) {
      await onDeactivate(); // 👍 취소
    } else {
      await onActivate(); // 👍 활성화
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        disabled={!isLoggedIn}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition ${
          isActive
            ? 'bg-blue-500 text-white'
            : 'bg-white text-black border-gray-300'
        } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}`}
      >
        👍
      </button>
    </div>
  );
};

export const DislikeButton: React.FC<ButtonProps> = ({
  isInitialActive = false,
  isLoggedIn,
  onActivate,
  onDeactivate,
}) => {
  const [isActive, setIsActive] = useState(isInitialActive);

  useEffect(() => {
    setIsActive(isInitialActive);
  }, [isInitialActive]);

  const handleClick = async () => {
    if (!isLoggedIn) return;

    setIsActive((prev) => !prev);

    if (isActive) {
      await onDeactivate(); // 👎 취소
    } else {
      await onActivate(); // 👎 활성화
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleClick}
        disabled={!isLoggedIn}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition ${
          isActive
            ? 'bg-red-500 text-white'
            : 'bg-white text-black border-gray-300'
        } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100'}`}
      >
        👎
      </button>
    </div>
  );
};
