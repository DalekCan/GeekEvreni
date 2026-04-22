import Link from 'next/link';

export default function ShowForum({ showName, showId }: { showName: string, showId: string }) {
  const forumTopics = [
    { id: 'genel', title: 'Genel', description: 'Genel Tartışma Odası' },
    { id: 'teoriler', title: 'Teoriler', description: 'Teoriler ve Varsayımlar' },
    { id: 'haberler', title: 'Haberler', description: 'Dizi Hakkında Son Gelişmeler' }
  ];

  return (
    <div className="mt-14 w-full">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-700/60 pb-4">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">{showName} Forum</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {forumTopics.map((topic) => (
          <Link 
            key={topic.id} 
            href={`/show/${showId}/forum/${topic.id}`}
            className="group block"
          >
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 shadow-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:border-indigo-500/50 hover:bg-slate-800 hover:-translate-y-1.5 h-full flex flex-col items-center text-center relative overflow-hidden">
              
              {/* Dekoratif Arka Plan Işığı */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/50 transition-all duration-500" />

              <h3 className="text-2xl font-black text-slate-100 group-hover:text-white mb-2 tracking-tight transition-colors">
                {topic.title}
              </h3>
              <p className="text-sm font-medium text-slate-400 mb-6 group-hover:text-slate-300 transition-colors">
                {topic.description}
              </p>
              
              <div className="mt-auto flex items-center gap-2 text-sm font-bold text-indigo-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                Odasına Git 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
