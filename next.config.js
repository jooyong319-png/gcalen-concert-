/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 백업/문서/스크립트는 빌드 대상에서 제외
  // (eslint/typecheck도)
  eslint: { ignoreDuringBuilds: false },
  // metadata.metadataBase 경고 방지
  experimental: {
    typedRoutes: false
  }
};
module.exports = nextConfig;
