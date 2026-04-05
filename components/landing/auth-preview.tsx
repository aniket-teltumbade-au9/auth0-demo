import { Mail, MapPin, MessageSquare, Phone, ShieldCheck, Video } from "lucide-react";

const integrations = [
    {
        title: "Agora",
        body: "Real-time video calls, audio rooms, and live streaming. Ideal for telehealth, edtech, or team collaboration SaaS products.",
        icon: Video,
        badge: "Demo coming soon",
        badgeColor: "bg-cyan-400/10 text-cyan-300",
        iconColor: "bg-cyan-400/10 text-cyan-200"
    },
    {
        title: "Google Maps Platform",
        body: "Location search, routing, distance matrix, and Places autocomplete for delivery, logistics, and marketplace apps.",
        icon: MapPin,
        badge: "Demo coming soon",
        badgeColor: "bg-emerald-500/10 text-emerald-300",
        iconColor: "bg-emerald-500/10 text-emerald-200"
    },
    {
        title: "WhatsApp Business (Meta)",
        body: "Send order notifications, OTP codes, and conversational messages via the official Meta Business API.",
        icon: MessageSquare,
        badge: "Demo coming soon",
        badgeColor: "bg-green-500/10 text-green-300",
        iconColor: "bg-green-500/10 text-green-200"
    },
    {
        title: "Twilio",
        body: "SMS alerts, voice calls, WhatsApp messaging, and programmable 2FA for any user base worldwide.",
        icon: Phone,
        badge: "Demo coming soon",
        badgeColor: "bg-violet-500/10 text-violet-300",
        iconColor: "bg-violet-500/15 text-violet-200"
    },
    {
        title: "SendGrid · Mailgun · MSG91",
        body: "Transactional and marketing email via SendGrid or Mailgun. India-market SMS and OTP delivery with MSG91.",
        icon: Mail,
        badge: "Demo coming soon",
        badgeColor: "bg-orange-500/10 text-orange-300",
        iconColor: "bg-orange-500/15 text-orange-200"
    },
    {
        title: "Auth0 · OAuth2 · JWT",
        body: "Social login, passwordless, account linking, and Management API — fully integrated and live on this page.",
        icon: ShieldCheck,
        badge: "Live now",
        badgeColor: "bg-emerald-500/10 text-emerald-300",
        iconColor: "bg-cyan-400/10 text-cyan-200"
    }
];

export function IntegrationsSection() {
    return (
        <section id="integrations" className="section-shell py-24">
            <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Integrations</p>
                <h2 className="section-title">Third-party APIs I can wire into your product</h2>
                <p className="section-copy">
                    Each integration below can be added to your NestJS or NextJS project. Demo pages for most are in progress — Auth0 is live right now.
                </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {integrations.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.title} className="glass-panel p-7">
                            <div className="flex items-start justify-between gap-2">
                                <div className={`rounded-2xl p-3 w-fit ${item.iconColor}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.badgeColor}`}>
                                    {item.badge}
                                </span>
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
