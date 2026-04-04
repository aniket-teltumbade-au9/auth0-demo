import { Building2, CheckCircle2, Globe2, ShieldEllipsis } from "lucide-react";

const domains = [
    { domain: "acme.com", status: "SSO active", color: "text-emerald-300" },
    { domain: "northwind.io", status: "SCIM + SSO staged", color: "text-cyan-300" },
    { domain: "contoso.co", status: "Sandbox ready", color: "text-violet-300" }
];

export function SSOWidget() {
    return (
        <div className="glass-panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Enterprise SSO</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Single sign-on across multiple domains</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                        Use this widget during the client demo to explain how Auth0 centralizes workforce and B2B login flows
                        across separate enterprise tenants, domains, and partner portals.
                    </p>
                </div>
                <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200">
                    <ShieldEllipsis className="h-6 w-6" />
                </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {domains.map((item) => (
                    <div key={item.domain} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
                        <div className="flex items-center gap-3 text-white">
                            <Building2 className="h-5 w-5 text-cyan-300" />
                            <span className="font-medium">{item.domain}</span>
                        </div>
                        <div className={`mt-4 flex items-center gap-2 text-sm ${item.color}`}>
                            <CheckCircle2 className="h-4 w-4" />
                            {item.status}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">
                <div className="flex items-start gap-3">
                    <Globe2 className="mt-1 h-5 w-5 text-cyan-300" />
                    <p>
                        Narrative cue: one Auth0 tenant can broker federation for employee identities, partner organizations,
                        and regional subdomains while preserving centralized policy, branding, and audit visibility.
                    </p>
                </div>
            </div>
        </div>
    );
}
