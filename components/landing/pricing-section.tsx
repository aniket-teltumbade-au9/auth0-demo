import { Check, Clock, Rocket, Star } from "lucide-react";

const tiers = [
    {
        name: "Hourly Contract",
        price: "$20",
        unit: "/hr",
        note: "Negotiable for 20+ hrs/week",
        description: "Best for ongoing tasks, bug fixes, feature additions, or short exploratory work.",
        icon: Clock,
        iconColor: "bg-cyan-400/10 text-cyan-200",
        featured: false,
        features: [
            "Auth0 / OAuth2 integration",
            "NestJS or Express REST API",
            "NextJS frontend development",
            "MongoDB or MySQL schema",
            "Weekly payout (Upwork / Freelancer)",
            "Rate negotiable for long-term"
        ],
        cta: "Hire on Upwork",
        href: "#"
    },
    {
        name: "Fixed-Scope Project",
        price: "From $499",
        unit: "",
        note: "Milestone-based payments",
        description: "Defined deliverables, no scope creep. Ideal for MVPs, feature modules, or integration builds.",
        icon: Rocket,
        iconColor: "bg-violet-500/15 text-violet-200",
        featured: true,
        features: [
            "Auth, API, DB, and deployment",
            "3rd-party integrations included",
            "Docker + AWS or Vercel deploy",
            "Payload CMS or custom admin",
            "1-week post-delivery support",
            "Full source code handoff"
        ],
        cta: "Request a quote",
        href: "#"
    },
    {
        name: "Retainer",
        price: "Custom",
        unit: "",
        note: "Weekly syncs · Priority support",
        description: "For startups and teams needing ongoing development, architecture input, and full ownership.",
        icon: Star,
        iconColor: "bg-amber-500/15 text-amber-200",
        featured: false,
        features: [
            "Agora, Maps, WhatsApp Business",
            "Twilio, SendGrid, MSG91 setup",
            "CI/CD pipelines + Docker",
            "AWS EC2, S3, RDS management",
            "Dedicated hours, priority queue",
            "Architecture reviews included"
        ],
        cta: "Let's talk",
        href: "#"
    }
];

export function PricingSection() {
    return (
        <section id="pricing" className="section-shell py-24">
            <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Service packages</p>
                <h2 className="section-title">Transparent pricing for freelance work</h2>
                <p className="section-copy">
                    All rates are in USD. Hourly work is billed weekly. Fixed-scope projects use milestone payments. Rates are negotiable for longer engagements.
                </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {tiers.map((tier) => {
                    const Icon = tier.icon;
                    return (
                        <div
                            key={tier.name}
                            className={tier.featured ? "glass-panel border-violet-400/40 p-8 shadow-glow" : "glass-panel p-8"}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className={`rounded-2xl p-3 w-fit ${tier.iconColor}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-2xl font-semibold text-white">{tier.name}</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-400">{tier.description}</p>
                                </div>
                                {tier.featured && (
                                    <span className="shrink-0 rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">
                                        Popular
                                    </span>
                                )}
                            </div>

                            <div className="mt-8">
                                <span className="text-4xl font-semibold text-white">{tier.price}</span>
                                {tier.unit && <span className="text-xl text-slate-400">{tier.unit}</span>}
                                <p className="mt-1 text-xs text-slate-500">{tier.note}</p>
                            </div>

                            <ul className="mt-8 space-y-4 text-sm text-slate-300">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={tier.href}
                                className={
                                    tier.featured
                                        ? "mt-8 inline-flex w-full items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                                        : "mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/5"
                                }
                            >
                                {tier.cta}
                            </a>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
