import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdminEmail } from './lib/adminAllowlist';

// A landing oldal a Figma Make-en él, www.betukert.hu saját domainnel (CNAME a Figmára);
// az apex a Vercelen marad a publikus aloldalak miatt, a gyökere a www-re irányít át.
// 307 (ideiglenes), hogy a böngészők ne cache-eljék, ha a landing később máshová költözik
const LANDING_URL = 'https://www.betukert.hu';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get('host') ?? '').split(':')[0];

  // A publikus fő domain csak a landing oldalt és a publikus aloldalakat szolgálja ki;
  // az admin az admin.betukert.hu-n (és a vercel.app címen) él
  if (host === 'betukert.hu' || host === 'www.betukert.hu') {
    if (
      pathname.startsWith('/adatvedelem') ||
      pathname.startsWith('/tamogatas') ||
      pathname.startsWith('/fiok-torles') ||
      pathname.startsWith('/megerositve') ||
      pathname.startsWith('/api/content') ||
      pathname.startsWith('/email/')
    ) {
      return NextResponse.next();
    }
    // A gyökér, a régi /landing és minden ismeretlen útvonal a Figma-s landingre megy
    return NextResponse.redirect(LANDING_URL, 307);
  }

  // A mobilapp által hívott publikus endpoint, a login oldal, az UI kit és a landing wireframe nem védett
  if (pathname.startsWith('/api/content') || pathname.startsWith('/login') || pathname.startsWith('/ui-kit') || pathname.startsWith('/wireframe') || pathname.startsWith('/landing') || pathname.startsWith('/adatvedelem') || pathname.startsWith('/tamogatas') || pathname.startsWith('/fiok-torles') || pathname.startsWith('/megerositve') || pathname.startsWith('/email/')) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() validálja a tokent a Supabase szerverrel — nem csak a cookie-t olvassa
  const { data: { user } } = await supabase.auth.getUser();

  // A session megléte nem elég: a mobilapp felhasználói is ebben a Supabase
  // projektben élnek, adminba csak az allowlistes e-mail címek léphetnek be
  if (!user || !isAdminEmail(user.email)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
