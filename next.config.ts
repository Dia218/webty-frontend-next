import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image-comic.pstatic.net', // 웹툰 썸네일의 호스트네임
        port: '',
        pathname: '/**', // 모든 경로 허용
      },
    ],
  },
};

export default nextConfig;
