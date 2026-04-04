import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type SiteHeaderProps = {
    isAuthenticated: boolean;
    userName?: string | null;
};

export function SiteHeader({ isAuthenticated, userName }: SiteHeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/75 backdrop-blur-xl">
            <div className="section-shell flex h-20 items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-glow">
                        <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                            Auth0 Client Demo
                        </p>
                        <p className="text-sm text-slate-400">Next.js + MongoDB showcase</p>
                    </div>
                </div>

                <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
                    <Link href="/">Overview</Link>
                    <Link href="/auth-demo">Auth Demo</Link>
                    <Link href="/settings">Settings</Link>
                    <a href="/#pricing">Pricing</a>
                    <a href="/#faq">FAQ</a>
                </nav>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:block">
                                Signed in as <span className="font-medium text-white">{userName || "Client user"}</span>
                            </div>
                            <a
                                href="/auth/logout?returnTo=http%3A%2F%2Flocalhost%3A3000%2Flogged-out"
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition",
                                    "hover:border-cyan-400/50 hover:bg-white/5"
                                )}
                            >
                                Logout
                            </a>
                        </>
                    ) : (
                        <a
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                        >
                            Launch demo
                            <ChevronRight className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
}
