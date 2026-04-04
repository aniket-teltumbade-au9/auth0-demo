import { Check } from "lucide-react";

const tiers = [
    {
        name: "Starter Demo",
        price: "$0",
        description: "For quick proof-of-concept walkthroughs and internal validation.",
        features: ["Landing page shell", "Basic Auth0 sign-in", "MongoDB user sync"]
    },
    {
        name: "Client Workshop",
        price: "$249",
        description: "The recommended tier for polished stakeholder presentations.",
        features: [
            "Social + passwordless showcase",
            "Protected settings experience",
            "Connected accounts flow",
            "Enterprise SSO storytelling"
        ],
        featured: true
    },
    {
        name: "Enterprise Rollout",
        price: "Custom",
        description: "For teams aligning production IAM, partner SSO, and identity governance.",
        features: ["Org-aware SSO demos", "Advanced MFA roadmap", "Token vault and linking advisory"]
    }
];

export function PricingSection() {
    return (
        <section id="pricing" className="section-shell py-24">
            <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Pricing grid</p>
                <h2 className="section-title">A familiar SaaS pricing section for the client narrative</h2>
                <p className="section-copy">
                    Use this section to frame implementation options while keeping the focus on the identity experience.
                </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={tier.featured ? "glass-panel border-violet-400/40 p-8 shadow-glow" : "glass-panel p-8"}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-2xl font-semibold text-white">{tier.name}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-400">{tier.description}</p>
                            </div>
                            {tier.featured ? (
                                <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
                                    Most relevant
                                </span>
                            ) : null}
                        </div>

                        <div className="mt-8 text-4xl font-semibold text-white">{tier.price}</div>
                        <ul className="mt-8 space-y-4 text-sm text-slate-300">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <Check className="mt-0.5 h-4 w-4 text-cyan-300" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
