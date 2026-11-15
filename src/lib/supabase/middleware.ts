import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const allowedAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const isAuthorizedAdmin =
        Boolean(user) &&
        (!allowedAdminEmail || user?.email?.toLowerCase() === allowedAdminEmail);

    // Block unauthenticated or non-allowlisted users from /admin
    if (
        !isAuthorizedAdmin &&
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')
    ) {
        const url = request.nextUrl.clone();
        url.pathname = user ? '/' : '/admin/login';
        return NextResponse.redirect(url);
    }

    // Redirect authorized admin away from login page
    if (isAuthorizedAdmin && request.nextUrl.pathname.startsWith('/admin/login')) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}