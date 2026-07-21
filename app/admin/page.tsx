import type { Metadata } from 'next';
import { getAllGames } from '@/lib/games';
import { getAllPosts } from '@/lib/blog';
import { AdminDashboard } from '@/components/AdminDashboard';

export const metadata: Metadata = {
  title: '관리자',
  robots: { index: false, follow: false }, // 검색 노출 금지
};

export default async function AdminPage() {
  const games = await getAllGames();
  const posts = await getAllPosts();
  const nameMap: Record<string, string> = {};
  for (const g of games) nameMap[g.id] = g.name;
  for (const p of posts) nameMap[`blog:${p.slug}`] = p.title; // 가이드 글 제목 매핑
  return <AdminDashboard nameMap={nameMap} />;
}
