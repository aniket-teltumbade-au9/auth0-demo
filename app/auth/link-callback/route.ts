import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const returnTo = searchParams.get("returnTo") ?? "/settings";
    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

    // get primary sub from cookie
    const primarySub = req.cookies.get("linking_primary_sub")?.value;
    const session = await auth0.getSession();

    if (!session?.user) {
        return NextResponse.redirect(new URL(returnTo, appBaseUrl));
    }

    if (primarySub && primarySub !== session.user.sub) {
        try {
            // fetch primary user profile to restore session correctly
            await auth0.updateSession({
                ...session,
                user: {
                    ...session.user,
                    sub: primarySub
                }
            });
        } catch (err) {
            console.error("Session restore failed", err);
        }
    }

    const response = NextResponse.redirect(new URL(returnTo, appBaseUrl));
    response.cookies.delete("linking_primary_sub");
    return response;
}