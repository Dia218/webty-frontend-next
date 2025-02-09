import React, { useState, useEffect } from 'react';

interface ButtonProps {
  isInitialActive?: boolean;
  isLoggedIn: boolean;
  onClick: () => void;
  count?: number; // 선택적 숫자 값
}

export const LikeButton: React.FC<ButtonProps> = ({
  isInitialActive = false,
  isLoggedIn,
  onClick,
  count = 0, // 기본값 0
}) => {
  const [isActive, setIsActive] = useState(isInitialActive);

  useEffect(() => {
    setIsActive(isInitialActive);
  }, [isInitialActive]);

  const handleClick = async () => {
    if (!isLoggedIn) return;
    setIsActive((prev) => !prev);
    await onClick();
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
      <span className="ml-2 text-lg font-semibold">{count}</span>
    </div>
  );
};

export const DislikeButton: React.FC<ButtonProps> = ({
  isInitialActive = false,
  isLoggedIn,
  onClick,
  count = 0,
}) => {
  const [isActive, setIsActive] = useState(isInitialActive);

  useEffect(() => {
    setIsActive(isInitialActive);
  }, [isInitialActive]);

  const handleClick = async () => {
    if (!isLoggedIn) return;
    setIsActive((prev) => !prev);
    await onClick();
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
      <span className="ml-2 text-lg font-semibold">{count}</span>
    </div>
  );
};
