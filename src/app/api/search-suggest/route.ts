import { NextResponse } from 'next/server';
import { searchTrending } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const type = searchParams.get('type') || '';

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchTrending(q, 1, type);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Auto-suggest API Error:', error);
    return NextResponse.json({ results: [], error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
