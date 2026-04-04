import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET(req: NextRequest) {
    const session = await auth0.getSession();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const connection = searchParams.get("connection") ?? "google-oauth2";
    const returnTo = searchParams.get("returnTo") ?? "/settings";

    const loginUrl = new URL("/auth/login", process.env.APP_BASE_URL ?? "http://localhost:3000");
    loginUrl.searchParams.set("connection", connection);
    loginUrl.searchParams.set("prompt", "login");
    loginUrl.searchParams.set("returnTo", returnTo);
    // pass primary sub to Auth0 so Action can access it
    loginUrl.searchParams.set("linking_primary_sub", session.user.sub);

    return NextResponse.redirect(loginUrl);
}