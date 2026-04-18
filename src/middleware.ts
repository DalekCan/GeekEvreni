import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // [!WARNING] Supabase Auth Edge Runtime'da (middleware) "fetch failed" hatası verip
  // arka plan Promise çökmelerine (Unhandled Rejection) neden olduğu için
  // ve şu an aktif bir Route Protection (Yönlendirme Koruması) yapmadığımız için
  // bu kısım şimdilik devre dışı bırakılmıştır. Layout tamamen sorunsuz çalışacaktır.
  /*
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return request.cookies.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({ name, value, ...options });
            supabaseResponse = NextResponse.next({ request: { headers: request.headers } });
            supabaseResponse.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: '', ...options });
            supabaseResponse = NextResponse.next({ request: { headers: request.headers } });
            supabaseResponse.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );
    await supabase.auth.getUser();
  } catch (e) {
  }
  */

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, icons vb.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
