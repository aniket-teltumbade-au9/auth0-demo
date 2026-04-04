import { ArrowRight, BadgeCheck, LockKeyhole, Orbit, Sparkles } from "lucide-react";

const trustPoints = [
    "Social login with branded Universal Login handoff",
    "Passwordless-ready UI for email and SMS OTP",
    "MongoDB profile sync on every successful callback"
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
                        <Sparkles className="h-4 w-4" />
                        Production-ready Auth0 client demo architecture
                    </div>
                    <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                        Ship a premium-feel identity demo without building the shell from scratch.
                    </h1>
                    <p className="section-copy max-w-3xl text-lg text-slate-300 md:text-xl">
                        This starter combines a polished SaaS landing page with an Auth0-first demo flow,
                        protected routes, passwordless entry points, SSO storytelling, and MongoDB-backed
                        profile sync.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <a
                            href={isAuthenticated ? "/auth-demo" : "/auth/login?returnTo=/auth-demo"}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                        >
                            {isAuthenticated ? "Open Auth Demo" : "Start Secure Sign-In"}
                            <ArrowRight className="h-4 w-4" />
                        </a>
                        <a
                            href={isAuthenticated ? "/settings" : "#pricing"}
                            className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/5"
                        >
                            {isAuthenticated ? "Open Settings" : "See the rollout plan"}
                        </a>
                    </div>

                    <div className="mt-8 grid gap-3 text-sm text-slate-300">
                        {trustPoints.map((point) => (
                            <div key={point} className="flex items-center gap-3">
                                <BadgeCheck className="h-5 w-5 text-cyan-300" />
                                <span>{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel overflow-hidden p-6 shadow-glow">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Demo Stack</p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">Identity control center</h2>
                            </div>
                            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-200">
                                <Orbit className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            {[
                                {
                                    title: "Auth0 Universal Login",
                                    body: "Social, passwordless, and enterprise federation are presented through a single branded flow.",
                                    icon: LockKeyhole
                                },
                                {
                                    title: "MongoDB Profile Store",
                                    body: "Post-login sync keeps editable demo fields available for account settings and client walkthroughs.",
                                    icon: BadgeCheck
                                },
                                {
                                    title: "Protected App Router Pages",
                                    body: "Middleware plus page-level protection gives the app a deployment-ready feel from day one.",
                                    icon: Sparkles
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
