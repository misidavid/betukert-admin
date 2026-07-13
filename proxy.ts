import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get('host') ?? '').split(':')[0];

  // A publikus fő domain csak a landing oldalt és a publikus aloldalakat szolgálja ki;
  // az admin az admin.betukert.hu-n (és a vercel.app címen) él
  if (host === 'betukert.hu' || host === 'www.betukert.hu') {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/landing', request.url));
    }
    if (
      pathname.startsWith('/landing') ||
      pathname.startsWith('/adatvedelem') ||
      pathname.startsWith('/tamogatas') ||
      pathname.startsWith('/megerositve') ||
      pathname.startsWith('/api/content') ||
      pathname.startsWith('/email/')
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // A mobilapp által hívott publikus endpoint, a login oldal és az UI kit nem védett
  if (pathname.startsWith('/api/content') || pathname.startsWith('/login') || pathname.startsWith('/ui-kit') || pathname.startsWith('/landing') || pathname.startsWith('/adatvedelem') || pathname.startsWith('/tamogatas') || pathname.startsWith('/megerositve') || pathname.startsWith('/email/')) {
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

  if (!user) {
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
