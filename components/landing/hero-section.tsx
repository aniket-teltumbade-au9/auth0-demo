import { ArrowRight, BadgeCheck, Server, Shield, Zap } from "lucide-react";

const stackPills = [
    "NestJS · NextJS · Express",
    "MongoDB · MySQL",
    "Docker · AWS · Payload CMS",
    "Auth0 · OAuth2 · JWT"
];

type HeroSectionProps = {
    isAuthenticated: boolean;
};

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
    return (
        <section className="section-shell pt-16 md:pt-24">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                        <Zap className="h-4 w-4" />
                        Available for hire · $20/hr · Weekly payout
                    </div>
                    <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                        Full-stack engineer. Auth, APIs, and production SaaS.
                    </h1>
                    <p className="section-copy max-w-3xl text-lg text-slate-300 md:text-xl">
                        I build scalable web applications using NestJS, NextJS, and MongoDB —
                        integrated with Auth0 identity flows, third-party APIs, and AWS or Docker deployment.
                        This page is a live working reference.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <a
                            href={isAuthenticated ? "/settings" : "/login"}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                        >
                            Explore live Auth demo
                            <ArrowRight className="h-4 w-4" />
                        </a>
                        <a
                            href="#pricing"
                            className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/5"
                        >
                            View service packages
                        </a>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                        {stackPills.map((pill) => (
                            <span key={pill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                                {pill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="glass-panel overflow-hidden p-6 shadow-glow">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Live demo stack</p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">Running right now</h2>
                            </div>
                            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-200">
                                <Server className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            {[
                                {
                                    title: "Auth0 · Social + Passwordless",
                                    body: "Google, Facebook, Twitter login with account linking and Management API session restore.",
                                    icon: Shield
                                },
                                {
                                    title: "MongoDB · Live profile sync",
                                    body: "Every login upserts the user record. Profile edits persist instantly — no page reload needed.",
                                    icon: BadgeCheck
                                },
                                {
                                    title: "Next.js 15 App Router",
                                    body: "Middleware-protected routes, server components, and API handlers — all wired and deployable.",
                                    icon: Zap
                                }
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 rounded-xl bg-white/5 p-3 text-cyan-200">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{item.title}</h3>
                                                <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
