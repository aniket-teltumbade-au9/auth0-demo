import { NextRequest, NextResponse } from "next/server";

import { auth0 } from "@/lib/auth0";
import { getAuth0User } from "@/lib/management";

/**
 * GET /auth/link-callback
 *
 * Runs after the secondary provider's OAuth flow completes.
 * At this point the session belongs to the secondary account.
 *
 * The Auth0 Post Login Action already linked the identities in Auth0.
 * It also set `linking_primary_sub` as an ID token custom claim on success.
 *
 * This handler:
 *  1. Reads the primary sub from the ID token claim (or cookie fallback).
 *  2. Fetches the primary user via Management API (M2M credentials).
 *  3. Restores the session to the primary user.
 *  4. Syncs the linked connection to MongoDB.
 *  5. Redirects to returnTo (usually /settings).
 */
export async function GET(req: NextRequest): Promise<Response> {
    const session = await auth0.getSession();

    if (!session?.user) {
        return NextResponse.redirect(
            new URL("/", process.env.APP_BASE_URL ?? "http://localhost:3000")
        );
    }

    const { searchParams } = new URL(req.url);
    const returnTo = searchParams.get("returnTo") ?? "/settings";
    const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

    const response = NextResponse.redirect(new URL(returnTo, appBaseUrl));
    // Always clear the cookie regardless of outcome
    response.cookies.delete("linking_primary_sub");

    // Prefer the ID token claim set by the Auth0 Action (most reliable).
    // Fall back to the httpOnly cookie set by /auth/connect.
    const primarySub =
        (session.user.linking_primary_sub as string | undefined) ||
        req.cookies.get("linking_primary_sub")?.value;

    // Nothing to restore — user logged in with their existing account
    if (!primarySub || primarySub === session.user.sub) return response;

    // The current session sub is the secondary (just-authenticated) account
    const secondarySub = session.user.sub;

    try {
        // Fetch the primary user profile (with updated identities after linking)
        const primaryUser = await getAuth0User(primarySub);

        // Restore the session to the primary user
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
                org_id: primaryUser.org_id ?? undefined,
                // Clear the linking claim from the restored session
                linking_primary_sub: undefined,
            },
        });

        // Sync linked connection to MongoDB
        try {
            const { syncUserProfile } = await import("@/lib/user-sync");
            await syncUserProfile(
                {
                    sub: primaryUser.user_id,
                    email: primaryUser.email,
                    name: primaryUser.name,
                    picture: primaryUser.picture,
                    nickname: primaryUser.nickname,
                },
                {
                    connectedAccount: {
                        // e.g. "google-oauth2" from "google-oauth2|12345"
                        provider: secondarySub.slice(0, secondarySub.indexOf("|")),
                        connection: secondarySub.slice(0, secondarySub.indexOf("|")),
                    },
                }
            );
        } catch (syncErr) {
            console.error("MongoDB sync failed after linking:", syncErr);
        }
    } catch (err) {
        console.error("Session restore failed after account linking:", err);
    }

    return response;
}