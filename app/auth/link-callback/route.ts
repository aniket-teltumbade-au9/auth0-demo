import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

async function getManagementToken(): Promise<string> {
    const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            grant_type: "client_credentials",
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
        })
    });
    if (!res.ok) throw new Error(`Management token failed: ${res.status}`);
    const { access_token } = await res.json();
    return access_token;
}

async function getPrimaryUser(primarySub: string) {
    const token = await getManagementToken();
    const res = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(primarySub)}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error(`Management user fetch failed: ${res.status}`);
    return res.json();
}

// withApiAuthRequired gives the handler the async storage context that
// updateSession needs to write the session cookie in App Router.
export const GET = auth0.withApiAuthRequired(async function linkCallback(
    req: Request
) {
    const request = req as unknown as NextRequest;
    const { searchParams } = new URL(request.url);
    const returnTo = searchParams.get("returnTo") ?? "/settings";
    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

    const primarySub = request.cookies.get("linking_primary_sub")?.value;
    const session = await auth0.getSession();

    const response = NextResponse.redirect(new URL(returnTo, appBaseUrl));
    response.cookies.delete("linking_primary_sub");

    if (!session?.user) return response;

    // Same account logged back in — nothing to merge
    if (!primarySub || primarySub === session.user.sub) return response;

    try {
        const primaryUser = await getPrimaryUser(primarySub);

        // updateSession in v4 App Router only needs the session object —
        // it reads/writes the cookie via the async storage set up by
        // withApiAuthRequired.
        await auth0.updateSession({
            ...session,
            user: {
                sub: primaryUser.user_id,
                name: primaryUser.name,
                nickname: primaryUser.nickname,
                given_name: primaryUser.given_name,
                family_name: primaryUser.family_name,
                picture: primaryUser.picture,
                email: primaryUser.email,
                email_verified: primaryUser.email_verified,
                org_id: primaryUser.org_id ?? undefined
            }
        });

        try {
            const { syncUserProfile } = await import("@/lib/user-sync");
            await syncUserProfile(
                {
                    sub: primaryUser.user_id,
                    email: primaryUser.email,
                    name: primaryUser.name,
                    picture: primaryUser.picture,
                    // email_verified: primaryUser.email_verified
                },
                {
                    connectedAccount: {
                        provider: session.user.sub.split("|")[0],
                        connection: session.user.sub.split("|")[0]
                    }
                }
            );
        } catch (syncError) {
            console.error("Profile sync failed after linking", syncError);
        }
    } catch (err) {
        console.error("Session restore failed after account linking", err);
    }

    return response;
});