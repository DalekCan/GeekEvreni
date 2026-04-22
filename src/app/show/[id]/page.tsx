import { notFound } from 'next/navigation';
import { getShowDetails, getCredits } from '@/lib/tmdb';
import ShowHeader from '@/components/ShowHeader';
import ShowForum from '@/components/ShowForum';
import SeasonList from '@/components/SeasonList';
import CastList from '@/components/CastList';
import { createServerSupabase } from '@/lib/supabase-server';
import TrackButton from '@/components/tracker/TrackButton';

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let user = null;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    // Supabase bağlantı hatası — giriş yapılmamış gibi devam eder
  }

  // TMDB'den detayları çek (dizi ve sezonları barındırır)
  const [show, cast] = await Promise.all([
    getShowDetails(resolvedParams.id),
    getCredits(resolvedParams.id, 'tv')
  ]);

  if (!show) {
    notFound();
  }

  // TMDB'den dönen seasons dizisinden sadece sezon numaralarını çıkarıyoruz
  const seasonNumbers = show.seasons
    ?.filter((s: any) => s.season_number > 0)
    .map((s: any) => s.season_number) || [];

  const trackBtn = user ? (
    <TrackButton showId={resolvedParams.id.toString()} showType={show.number_of_seasons ? 'tv' : 'movie'} />
  ) : null;

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
        <ShowHeader show={show} trackButton={trackBtn} />
        <CastList cast={cast} />
        <ShowForum showName={show.name || show.title || 'İsimsiz Dizi'} showId={resolvedParams.id.toString()} />
        <SeasonList seasons={seasonNumbers} showId={resolvedParams.id} />
      </main>
    </div>
  );
}
