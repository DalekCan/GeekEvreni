import Image from 'next/image';
import { Show } from '@/lib/mockData';

export default function ShowHeader({ show }: { show: Show }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 bg-slate-800 p-6 sm:p-8 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex-shrink-0 w-full md:w-64 h-96 relative rounded-lg overflow-hidden border border-slate-600 shadow-md">
        <Image 
          src={show.poster_url} 
          alt={`${show.title} Poster`} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 256px"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {show.title}
        </h1>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
          <p className="text-lg text-slate-300 leading-relaxed">
            {show.synopsis}
          </p>
        </div>
      </div>
    </div>
  );
}
