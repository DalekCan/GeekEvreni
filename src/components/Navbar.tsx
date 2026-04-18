import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase-server';
import GoogleLoginButton from './auth/GoogleLoginButton';
import LogoutButton from './auth/LogoutButton';
import Search from './Search';

export default async function Navbar() {
  let user = null;
  try {
    const supabase = await createServerSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    user = session?.user;
  } catch (e) {
    // Çökme yaşanmaması için hatayı yut
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 h-16 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Sol: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-bold text-xl tracking-tight text-white hover:text-slate-300 transition-colors">
              GeekEvreni
            </Link>
          </div>

          {/* Orta: Arama Çubuğu */}
          <div className="flex-1 max-w-lg mx-8 hidden sm:block">
            <Search />
          </div>

          {/* Sağ: Giriş Yap Butonu / Avatar */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {user.user_metadata?.full_name || 'Kullanıcı'}
                  </span>
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full border border-slate-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="h-5 w-px bg-slate-700"></div>
                <LogoutButton />
              </div>
            ) : (
              <GoogleLoginButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
