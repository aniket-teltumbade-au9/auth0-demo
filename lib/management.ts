/**
 * lib/management.ts
 *
 * Server-only — Node.js runtime, NOT Edge.
 * Helper functions that call the Auth0 Management API using M2M credentials.
 *
 * Required env vars:
 *   AUTH0_DOMAIN            — e.g. dev-xxx.us.auth0.com
 *   AUTH0_M2M_CLIENT_ID     — M2M app client_id
 *   AUTH0_M2M_CLIENT_SECRET — M2M app client_secret
 *   AUTH0_MGMT_AUDIENCE     — https://<domain>/api/v2/   (optional, derived if absent)
 */

export type Auth0IdentityProfileData = {
    name?: string;
    nickname?: string;
    email?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    /** Twitter/X handle (without @) */
    screen_name?: string;
    /** Twitter/X: "true" | "false" as string; others: boolean */
    email_verified?: boolean | string;
};

export type Auth0Identity = {
    provider: string;
    user_id: string;
    connection: string;
    isSocial: boolean;
    /** Profile fields from the linked identity provider */
    profileData?: Auth0IdentityProfileData;
};

export type Auth0MgmtUser = {
    user_id: string;
    email?: string;
    name?: string;
    nickname?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    email_verified?: boolean;
    org_id?: string;
    identities: Auth0Identity[];
};

async function getM2MToken(): Promise<string> {
    const domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_M2M_CLIENT_ID;
    const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;
    const audience =
        process.env.AUTH0_MGMT_AUDIENCE ?? `https://${domain}/api/v2/`;

    if (!domain || !clientId || !clientSecret) {
        throw new Error(
            "Missing M2M credentials. Set AUTH0_M2M_CLIENT_ID and AUTH0_M2M_CLIENT_SECRET."
        );
    }

    const res = await fetch(`https://${domain}/oauth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
            audience,
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`M2M token request failed: ${res.status} — ${body}`);
    }

    const { access_token } = (await res.json()) as { access_token: string };
    return access_token;
}

/**
 * Fetch a full user record (including identities) from Auth0 Management API.
 */
export async function getAuth0User(sub: string): Promise<Auth0MgmtUser> {
    const token = await getM2MToken();

    const res = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(sub)}`,
        {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Auth0 user fetch failed: ${res.status} — ${body}`);
    }

    return res.json() as Promise<Auth0MgmtUser>;
}

/**
 * Link a secondary Auth0 account into a primary account.
 * After this call the primary user's `identities` array includes the secondary.
 *
 * Uses the M2M token approach — no secondary access-token required.
 * Auth0 returns 409 if the accounts are already linked; we treat that as success.
 */
export async function linkAuth0Accounts(
    primarySub: string,
    secondarySub: string
): Promise<void> {
    const pipeIndex = secondarySub.indexOf("|");
    const provider = secondarySub.slice(0, pipeIndex);
    const userId = secondarySub.slice(pipeIndex + 1);

    const token = await getM2MToken();

    const res = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(primarySub)}/identities`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ provider, user_id: userId }),
            cache: "no-store",
        }
    );

    // 409 = already linked — not an error for our purposes
    if (!res.ok && res.status !== 409) {
        const body = await res.text();
        throw new Error(
            `Auth0 account linking failed: ${res.status} — ${body}`
        );
    }
}
