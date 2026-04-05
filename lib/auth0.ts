import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";

type CallbackContextWithConnectedAccount = {
    appBaseUrl?: string;
    returnTo?: string;
    connectedAccount?: {
        connection?: string | null;
        provider?: string | null;
    } | null;
};

const myAccountAudience = undefined;

const useDPoP = Boolean(
    process.env.AUTH0_DPOP_PUBLIC_KEY && process.env.AUTH0_DPOP_PRIVATE_KEY
);

const configuredBaseUrl = getConfiguredBaseUrl();
const primaryBaseUrl = Array.isArray(configuredBaseUrl)
    ? configuredBaseUrl[0]
    : configuredBaseUrl;

function getConfiguredBaseUrl() {
    const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
    const values = baseUrl
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    if (values.length <= 1) return values[0];
    return values;
}

function getAuthErrorMessage(error: unknown) {
    if (!error || typeof error !== "object") {
        return "An error occurred during the authorization flow.";
    }
    const candidate = error as {
        message?: string;
        cause?: {
            message?: string;
            error?: string;
            error_description?: string;
        };
    };
    return (
        candidate.cause?.error_description ||
        candidate.cause?.message ||
        candidate.message ||
        "An error occurred during the authorization flow."
    );
}

export const auth0 = new Auth0Client({
    appBaseUrl: configuredBaseUrl,
    useDPoP,
    enableConnectAccountEndpoint: false,
    signInReturnToPath: "/settings",
    session: {
        rolling: true,
        absoluteDuration: 60 * 60 * 24 * 7,
        inactivityDuration: 60 * 60 * 24,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }
    },
    authorizationParameters: myAccountAudience
        ? {
            audience: myAccountAudience,
            scope: "openid profile email offline_access create:me:connected_accounts identities:read identities:manage"
        }
        : {
            scope: "openid profile email offline_access create:me:connected_accounts identities:read identities:manage"
        },
    async beforeSessionSaved(session) {
        return {
            ...session,
            user: {
                sub: session.user.sub,
                name: session.user.name,
                nickname: session.user.nickname,
                given_name: session.user.given_name,
                family_name: session.user.family_name,
                picture: session.user.picture,
                email: session.user.email,
                email_verified: session.user.email_verified,
                org_id: session.user.org_id,
                // Preserve the custom claim set by the Auth0 Post Login Action.
                // It signals that linking completed and identifies the primary user.
                linking_primary_sub: session.user.linking_primary_sub ?? undefined
            }
        };
    },
    async onCallback(error, context, session) {
        const callbackContext = context as CallbackContextWithConnectedAccount;
        const appBaseUrl =
            callbackContext.appBaseUrl ?? primaryBaseUrl ?? "http://localhost:3000";

        if (error) {
            const url = new URL("/auth-error", appBaseUrl);
            url.searchParams.set("message", getAuthErrorMessage(error));
            return NextResponse.redirect(url);
        }

        // NOTE: Do NOT import or call Mongoose/user-sync here.
        // auth0.ts is imported by middleware.ts which runs in the Edge runtime.
        // Webpack statically bundles ALL imports in this file (including dynamic
        // ones) into the middleware chunk — Mongoose is Node.js-only and crashes.
        // Profile syncing is handled in Node.js runtime contexts:
        //   • app/settings/page.tsx  (Server Component)
        //   • app/auth/link-callback/route.ts  (Route Handler)

        return NextResponse.redirect(
            new URL(callbackContext.returnTo ?? "/auth-demo", appBaseUrl)
        );
    }
});