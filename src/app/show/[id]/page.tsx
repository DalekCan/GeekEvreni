import { notFound } from 'next/navigation';
import ShowHeader from '@/components/ShowHeader';
import SeasonList from '@/components/SeasonList';
import { mockShows } from '@/lib/mockData';

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowPage({ params }: ShowPageProps) {
  // Await the params
  const resolvedParams = await params;
  
  // Şimdilik API bağlı olmadığı için mock data'dan ID'ye göre filtreleme yapıyoruz.
  const show = mockShows.find(s => s.id === resolvedParams.id);

  if (!show) {
    // Bulunamazsa 404 sayfasına yönlendirir.
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 
        Tasarım modüler tutulmuştur. 
        Sayfa içeriği yalnızca Data Fetching ve Component birleştirmeyi üstlenir. 
      */}
      <ShowHeader show={show} />
      <SeasonList seasons={show.seasons} showId={show.id} />
    </div>
  );
}
