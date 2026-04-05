import { Database, Settings2 } from "lucide-react";

import { ConnectedAccountsCard } from "@/components/settings/connected-accounts-card";
import { ProfileForm } from "@/components/settings/profile-form";
import { auth0 } from "@/lib/auth0";
import { type Auth0Identity, getAuth0User } from "@/lib/management";
import { getUserProfile, syncUserProfile } from "@/lib/user-sync";

export default auth0.withPageAuthRequired(
    async function SettingsPage() {
        const session = await auth0.getSession();

        if (!session) {
            return null;
        }

        // Fetch Auth0 identities and MongoDB profile in parallel.
        // Auth0 is the source of truth for linked providers; MongoDB holds profile edits.
        const [auth0User, profile] = await Promise.allSettled([
            getAuth0User(session.user.sub),
            getUserProfile(session.user.sub),
        ]);

        const resolvedAuth0User =
            auth0User.status === "fulfilled" ? auth0User.value : null;
        const resolvedProfile =
            profile.status === "fulfilled" ? profile.value : null;

        // Derive the primary connection from the sub prefix (e.g. "google-oauth2")
        const primaryConnection =
            resolvedProfile?.primaryConnection ||
            session.user.sub.split("|")[0] ||
            "auth0";

        // Build the full provider set: Auth0 identities are canonical,
        // MongoDB connectedConnections fill in if the Management API call failed.
        const auth0Identities: Auth0Identity[] = resolvedAuth0User?.identities ?? [];
        const auth0Connections = auth0Identities.map((id) => id.provider);
        const mongoConnections = resolvedProfile?.connectedConnections ?? [];

        const mergedConnections = Array.from(
            new Set(
                [...auth0Connections, ...mongoConnections, primaryConnection]
                    .filter(Boolean)
                    .map((c) => c.toLowerCase())
            )
        );

        // Sync MongoDB in the background so it stays up to date with Auth0.
        syncUserProfile(session.user, {
            connectedAccount: undefined,
        }).catch((err) => console.error("Background MongoDB sync failed:", err));

        return (
            <section className="section-shell py-16 md:py-20">
                <div className="max-w-3xl">
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Protected settings</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        Account center for profile edits and linked identities
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-slate-300">
                        This page blends Auth0 session data with MongoDB profile fields so the client sees a realistic post-login settings experience.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <ProfileForm
                        initialName={resolvedProfile?.name || session.user.name || "Auth0 Demo User"}
                        initialBio={resolvedProfile?.bio || ""}
                        email={resolvedProfile?.email || session.user.email}
                    />

                    <div className="space-y-6">
                        <ConnectedAccountsCard
                            connections={mergedConnections}
                            primaryConnection={primaryConnection}
                            identities={auth0Identities}
                        />
                        <div className="glass-panel p-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200">
                                    <Settings2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Demo implementation notes</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        The profile form persists to MongoDB. Account linking uses Auth0&apos;s built-in connected accounts route and returns here after the provider consent flow.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-panel p-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                                    <Database className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">MongoDB sync</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        Every successful callback silently upserts the user record. Current primary connection: <span className="font-medium text-white">{resolvedProfile?.primaryConnection || session.user.sub.split("|")[0]}</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    },
    { returnTo: "/settings" }
);
