import { NextResponse } from "next/server";

import { auth0 } from "@/lib/auth0";

/**
 * GET /api/management-token
 *
 * Server-only endpoint — protected by Auth0 session.
 * Exchanges the M2M client credentials for an Auth0 Management API access token.
 * The token is returned to the caller so it can be forwarded to Management API calls.
 *
 * Required env vars:
 *  AUTH0_DOMAIN              — your tenant domain, e.g. dev-xxx.us.auth0.com
 *  AUTH0_M2M_CLIENT_ID       — M2M app client_id
 *  AUTH0_M2M_CLIENT_SECRET   — M2M app client_secret
 *  AUTH0_MGMT_AUDIENCE       — https://<domain>/api/v2/
 */
export async function GET(_req: Request): Promise<Response> {
    const session = await auth0.getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_M2M_CLIENT_ID;
    const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;
    const audience = process.env.AUTH0_MGMT_AUDIENCE;

    if (!domain || !clientId || !clientSecret || !audience) {
        return NextResponse.json(
            { error: "Missing required environment variables for Management API token." },
            { status: 500 }
        );
    }

    const response = await fetch(`https://${domain}/oauth/token`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            audience,
            grant_type: "client_credentials",
        }),
        // Never cache Management API tokens — they carry elevated privileges
        cache: "no-store",
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Management API token request failed:", errorBody);
        return NextResponse.json(
            { error: "Failed to obtain management token.", detail: errorBody },
            { status: response.status }
        );
    }

    const data = await response.json();

    // Return only what the caller needs — don't expose refresh tokens etc.
    return NextResponse.json({
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
    });
}
