import { Link2, ShieldCheck } from "lucide-react";

import { formatConnectionName } from "@/lib/utils";

type ConnectedAccountsCardProps = {
    connections: string[];
    primaryConnection: string;
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

export function ConnectedAccountsCard({
    connections,
    primaryConnection
}: ConnectedAccountsCardProps) {
    const connectedSet = new Set(
        [...connections, primaryConnection]
            .filter(Boolean)
            .map((connection) => connection.toLowerCase())
    );

    return (
        <div className="glass-panel p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Account linking</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Connected accounts</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                        Powered by Auth0's connected accounts flow. Linking routes return to this page after the provider handshake completes.
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

                    return (
                        <div
                            key={provider.id}
                            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="font-semibold text-white">{provider.label}</p>
                                <p className="mt-1 text-sm text-slate-400">
                                    {provider.label}:{" "}
                                    {isPrimary
                                        ? "Connected (current login provider)"
                                        : isConnected
                                            ? "Connected"
                                            : "Not linked"}
                                </p>
                            </div>
                            {isConnected ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                                    <ShieldCheck className="h-4 w-4" />
                                    {isPrimary ? "Current" : "Connected"}
                                </span>
                            ) : (
                                <a
                                    href={provider.href}
                                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/5"
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
                <p className="mt-2">
                    For production linking, enable the Auth0 connected accounts feature and allow Offline Access on the social connection permissions.
                </p>
            </div>
        </div>
    );
}
