import { BadgeCheck, Building2, Mail, MessageSquareText, Users } from "lucide-react";

import { PasswordlessPanel } from "@/components/passwordless-panel";
import { SSOWidget } from "@/components/sso-widget";
import { auth0 } from "@/lib/auth0";

export default auth0.withPageAuthRequired(
    async function AuthDemoPage() {
        const session = await auth0.getSession();

        return (
            <section className="section-shell py-16 md:py-20">
                <div className="max-w-3xl">
                    <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Protected Auth Demo</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                        Showcase Auth0 flows inside a premium product shell
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-slate-300">
                        Welcome back, <span className="font-semibold text-white">{session?.user.name || session?.user.email}</span>. Use these cards to guide the client through social, passwordless, and enterprise federation stories.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                    <div className="glass-panel p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Social buttons</p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">Google and Facebook</h2>
                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    Send users to Auth0's Universal Login with a specific connection so the client can see the branded social path.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4">
                            <a
                                href="/auth/login?connection=google-oauth2&returnTo=/auth-demo"
                                className="inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white px-4 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                            >
                                Continue with Google
                                <BadgeCheck className="h-4 w-4" />
                            </a>
                            <a
                                href="/auth/login?connection=facebook&returnTo=/auth-demo"
                                className="inline-flex items-center justify-between rounded-2xl border border-white/10 px-4 py-4 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/5"
                            >
                                Continue with Facebook
                                <Users className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Capability guide</p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">What this page demonstrates</h2>
                            </div>
                            <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200">
                                <Building2 className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-8 space-y-4 text-sm text-slate-300">
                            {[
                                {
                                    title: "Social entry points",
                                    body: "Connection-specific login buttons make it easy to tell a clean B2C story.",
                                    icon: Users
                                },
                                {
                                    title: "Passwordless triggers",
                                    body: "Email and SMS launchers demonstrate low-friction sign-in for support and field workflows.",
                                    icon: Mail
                                },
                                {
                                    title: "Enterprise SSO",
                                    body: "The widget below explains how Auth0 federates multiple partner or workforce domains.",
                                    icon: MessageSquareText
                                }
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                                        <div className="flex gap-4">
                                            <div className="rounded-2xl bg-white/5 p-3 text-cyan-200">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{item.title}</h3>
                                                <p className="mt-2 leading-7 text-slate-400">{item.body}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <PasswordlessPanel />
                </div>

                <div className="mt-6">
                    <SSOWidget />
                </div>
            </section>
        );
    },
    { returnTo: "/auth-demo" }
);
