const adjectives = [
  '행복한', '즐거운', '신나는', '귀여운', '멋진',
  '똑똑한', '친절한', '용감한', '현명한', '재미있는',
  '활발한', '상냥한', '씩씩한', '당당한', '예쁜'
];

const animals = [
  '사자', '호랑이', '토끼', '거북이', '코끼리',
  '판다', '고양이', '강아지', '여우', '늑대',
  '기린', '펭귄', '코알라', '햄스터', '다람쥐'
];

export const generateRandomNickname = (): string => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective} ${animal}`;
};

// 테스트 모드용 고정 닉네임
const TEST_NICKNAMES = ['즐거운 판다', '행복한 토끼', '신나는 고양이'];
let currentTestNicknameIndex = 0;

export const getNextTestNickname = (): string => {
  const nickname = TEST_NICKNAMES[currentTestNicknameIndex];
  currentTestNicknameIndex = (currentTestNicknameIndex + 1) % TEST_NICKNAMES.length;
  return nickname;
};

export const getTestNicknames = (): string[] => {
  return TEST_NICKNAMES;
}; 