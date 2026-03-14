import { notFound } from 'next/navigation';
import { mockShows } from '@/lib/mockData';
import ShowHeader from '@/components/ShowHeader';
import SeasonList from '@/components/SeasonList';
import Navbar from '@/components/Navbar';

export default async function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const show = mockShows.find(s => s.id === resolvedParams.id);

  if (!show) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
        <ShowHeader show={show} />
        <SeasonList seasons={show.seasons} showId={show.id} />
      </main>
    </div>
  );
}
