import { Building2, KeyRound, Users } from "lucide-react";

export function AuthPreviewSection() {
    return (
        <section className="section-shell py-24">
            <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Auth demo preview</p>
                <h2 className="section-title">Pre-built story beats for the identity walkthrough</h2>
                <p className="section-copy">
                    The demo area is designed to make Google, Facebook, passwordless, and enterprise SSO tangible in a single pass.
                </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {[
                    {
                        title: "Social login",
                        body: "Show branded Google and Facebook entry points that send users into Auth0's Universal Login.",
                        icon: Users
                    },
                    {
                        title: "Passwordless",
                        body: "Demonstrate email OTP and SMS OTP triggers with a polished control surface for business users.",
                        icon: KeyRound
                    },
                    {
                        title: "Enterprise SSO",
                        body: "Position Auth0 as the orchestration layer for partner, workforce, and multi-domain federation.",
                        icon: Building2
                    }
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.title} className="glass-panel p-7">
                            <div className="rounded-2xl bg-white/5 p-3 text-cyan-200 w-fit">
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-400">{item.body}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
