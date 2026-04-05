import { ExternalLink, Link2, ShieldCheck } from "lucide-react";

import { type Auth0Identity } from "@/lib/management";
import { formatConnectionName } from "@/lib/utils";

type ConnectedAccountsCardProps = {
    connections: string[];
    primaryConnection: string;
    identities?: Auth0Identity[];
};

const providers = [
    {
        id: "google-oauth2",
        label: "Google",
        href: "/auth/connect?connection=google-oauth2&returnTo=/settings"
    },
    {
        id: "facebook",
        label: "Facebook",
        href: "/auth/connect?connection=facebook&returnTo=/settings"
    },
    {
        id: "twitter",
        label: "Twitter / X",
        href: "/auth/connect?connection=twitter&returnTo=/settings"
    }
];

function getIdentityDisplay(
    provider: string,
    identity: Auth0Identity | undefined
): { username: string | null; profileUrl: string | null } {
    if (!identity?.profileData) return { username: null, profileUrl: null };

    const pd = identity.profileData;

    if (provider === "google-oauth2") {
        return {
            username: pd.email ?? pd.name ?? null,
            profileUrl: null, // Google doesn't expose profile URLs via OAuth
        };
    }

    if (provider === "facebook") {
        return {
            username: pd.name ?? pd.email ?? null,
            profileUrl: identity.user_id
                ? `https://facebook.com/${identity.user_id}`
                : null,
        };
    }

    if (provider === "twitter" || provider === "x") {
        const handle = pd.screen_name ?? pd.nickname ?? null;
        return {
            username: handle ? `@${handle}` : (pd.name ?? null),
            profileUrl: handle ? `https://x.com/${handle}` : null,
        };
    }

    return {
        username: pd.email ?? pd.name ?? pd.nickname ?? null,
        profileUrl: null,
    };
}

export function ConnectedAccountsCard({
    connections,
    primaryConnection,
    identities = [],
}: ConnectedAccountsCardProps) {
    const connectedSet = new Set(
        [...connections, primaryConnection]
            .filter(Boolean)
            .map((connection) => connection.toLowerCase())
    );

    // Build a lookup map: provider → identity object
    const identityMap = new Map<string, Auth0Identity>();
    for (const id of identities) {
        identityMap.set(id.provider.toLowerCase(), id);
        // Alias x ↔ twitter
        if (id.provider === "twitter") identityMap.set("x", id);
        if (id.provider === "x") identityMap.set("twitter", id);
    }

    return (
        <div className="glass-panel p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Account linking</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Connected accounts</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        Powered by Auth0&apos;s connected accounts flow. Linking routes return to this page after the provider handshake completes.
                    </p>
                </div>
                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                    <Link2 className="h-5 w-5" />
                </div>
            </div>

            <div className="mt-8 space-y-4">
                {providers.map((provider) => {
                    const normalizedId = provider.id.toLowerCase();
                    const isConnected =
                        connectedSet.has(normalizedId) ||
                        (normalizedId === "twitter" && connectedSet.has("x"));
                    const isPrimary =
                        primaryConnection.toLowerCase() === normalizedId ||
                        (normalizedId === "twitter" && primaryConnection.toLowerCase() === "x");

                    const identity = identityMap.get(normalizedId);
                    const { username, profileUrl } = getIdentityDisplay(normalizedId, identity);

                    return (
                        <div
                            key={provider.id}
                            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                                <p className="font-semibold text-white">{provider.label}</p>
                                {isConnected && username ? (
                                    <div className="mt-1 flex items-center gap-1.5">
                                        {profileUrl ? (
                                            <a
                                                href={profileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:underline truncate"
                                            >
                                                {username}
                                                <ExternalLink className="h-3 w-3 shrink-0" />
                                            </a>
                                        ) : (
                                            <span className="text-sm text-slate-300 truncate">{username}</span>
                                        )}
                                        {isPrimary && (
                                            <span className="text-xs text-slate-500">· primary</span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-1 text-sm text-slate-500">
                                        {isConnected
                                            ? isPrimary ? "Current login provider" : "Linked"
                                            : "Not linked"}
                                    </p>
                                )}
                            </div>
                            {isConnected ? (
                                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                    <ShieldCheck className="h-4 w-4" />
                                    {isPrimary ? "Current" : "Connected"}
                                </span>
                            ) : (
                                <a
                                    href={provider.href}
                                    className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/5"
                                >
                                    Link {provider.label}
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-400">
                Current connections in MongoDB: <span className="text-white">{connections.map(formatConnectionName).join(", ") || "None recorded yet"}</span>
                <p className="mt-2">
                    Current sign-in provider: <span className="text-white">{formatConnectionName(primaryConnection)}</span>
                </p>
            </div>
        </div>
    );
}
