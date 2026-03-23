import Image from 'next/image';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export default function CastList({ cast }: { cast: CastMember[] }) {
  if (!cast || cast.length === 0) return null;

  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 px-2 border-l-4 border-indigo-500">
        Oyuncular
      </h2>
      
      <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
        {cast.slice(0, 20).map((actor) => (
          <div key={actor.id} className="flex-shrink-0 w-32 snap-start flex flex-col group">
            <a 
              href={`https://www.themoviedb.org/person/${actor.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative w-32 h-48 rounded-xl overflow-hidden bg-slate-800 shadow-lg border border-slate-700/50 block mb-3 transition-transform duration-300 group-hover:scale-105 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/20"
            >
              {actor.profile_path ? (
                <Image 
                  src={`${TMDB_IMAGE_BASE}${actor.profile_path}`}
                  alt={actor.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            </a>
            
            <a 
              href={`https://www.themoviedb.org/person/${actor.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-slate-200 text-sm leading-tight hover:text-indigo-400 transition-colors line-clamp-2"
              title={actor.name}
            >
              {actor.name}
            </a>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2" title={actor.character}>
              {actor.character}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
