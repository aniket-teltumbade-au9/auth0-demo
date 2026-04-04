import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth0 } from "@/lib/auth0";

const PUBLIC_PATHS = new Set(["/", "/auth-error", "/login", "/signup", "/auth-callback-popup", "/logged-out"]);

export async function middleware(request: NextRequest) {
    const authResponse = await auth0.middleware(request);
    const { pathname, search } = request.nextUrl;

    if (pathname.startsWith("/auth")) {
        return authResponse;
    }

    return authResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
    ]
};

