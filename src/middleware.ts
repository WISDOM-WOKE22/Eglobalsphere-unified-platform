import { NextResponse, NextRequest } from "next/server";

// Uncomment when implementing role-based authorization
// const VALID_ROLES = {
//     USER: 'USER',
//     ADMIN: 'ADMIN',
// } as const;

const ROUTE_PERMISSIONS: Record<string, string> = {
    '/customizations': 'customizations',
    '/licenses': 'licenses',
    '/dashboard': 'dashboard',
    '/notifications': 'notifications',
    '/reports': 'reports',
    '/support': 'support',
    '/spherex-dashboard': 'spherex-dashboard',
    '/spherex-employees': 'spherex-employees',
    '/spherex-visitors': 'spherex-visitors',
    '/spherex-logs': 'spherex-logs',
    '/lpr-overview': 'lpr-overview',
    '/lpr-plates': 'lpr-plates',
    '/lpr-gates': 'lpr-gates',
    '/lpr-logs': 'lpr-logs',
    '/violation-overview': 'violation-overview',
    '/violation-logs': 'violation-logs',
    '/farouq-overview': 'farouq-overview',
    '/farouq-employees': 'farouq-employees',
    '/farouq-logs': 'farouq-logs',
};

const AUTH_ROUTES = [
    '/login',
    '/sign-up',
    '/2fa',
    '/forget-password',
    '/password-reset',
    '/verify-otp',
    '/password',
    '/pricing',
    '/blog',
    '/',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if user has auth token (JWT)
    const authToken = request.cookies.get('auth-token')?.value;
    const isAuthenticated = !!authToken;

    // Redirect unauthenticated users on protected routes
    const isProtected = Object.keys(ROUTE_PERMISSIONS).some((route) =>
        pathname.startsWith(route)
    );
    if (!isAuthenticated) {
        if (isProtected) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('callbackUrl', encodeURIComponent(request.url));
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    // Redirect authenticated users away from auth routes
    if (AUTH_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Authorization check (role-based - uncomment if you add role cookie)
    // const userRole = request.cookies.get('role')?.value as keyof typeof VALID_ROLES | undefined;
    // const permissionKey = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    //     pathname.startsWith(route)
    // );
    // if (permissionKey && userRole) {
    //     const requiredPermission = ROUTE_PERMISSIONS[permissionKey];
    //     const allowedPermissions = PERMISSIONS[userRole] || [];
    //     if (!allowedPermissions.includes(requiredPermission)) {
    //         return NextResponse.rewrite(new URL('/unauthorized', request.url));
    //     }
    // }


    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};