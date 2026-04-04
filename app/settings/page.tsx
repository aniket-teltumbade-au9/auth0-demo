import { Database, Settings2 } from "lucide-react";

import { ConnectedAccountsCard } from "@/components/settings/connected-accounts-card";
import { ProfileForm } from "@/components/settings/profile-form";
import { auth0 } from "@/lib/auth0";
import { getUserProfile } from "@/lib/user-sync";

export default auth0.withPageAuthRequired(
    async function SettingsPage() {
        const session = await auth0.getSession();

        if (!session) {
            return null;
        }

        const profile = await getUserProfile(session.user.sub);
        const primaryConnection =
            profile?.primaryConnection || session.user.sub.split("|")[0] || "auth0";
        const mergedConnections = Array.from(
            new Set([...(profile?.connectedConnections || []), primaryConnection])
        );

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
                        initialName={profile?.name || session.user.name || "Auth0 Demo User"}
                        initialBio={profile?.bio || ""}
                        email={profile?.email || session.user.email}
                    />

                    <div className="space-y-6">
                        <ConnectedAccountsCard
                            connections={mergedConnections}
                            primaryConnection={primaryConnection}
                        />
                        <div className="glass-panel p-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200">
                                    <Settings2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-white">Demo implementation notes</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        The profile form persists to MongoDB. Account linking uses Auth0's built-in connected accounts route and returns here after the provider consent flow.
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
                                        Every successful callback silently upserts the user record. Current primary connection: <span className="font-medium text-white">{profile?.primaryConnection || session.user.sub.split("|")[0]}</span>.
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
