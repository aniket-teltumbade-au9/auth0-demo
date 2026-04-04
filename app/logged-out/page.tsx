import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata = { title: "Signed out — Auth0 Demo" };

export default function LoggedOutPage() {
    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-16">
            <div className="w-full max-w-[400px] text-center">
                {/* Brand mark */}
                <Link
                    href="/"
                    className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-glow transition hover:scale-105"
                >
                    <ShieldCheck className="h-6 w-6 text-white" />
                </Link>

                <div className="glass-panel px-8 py-10 shadow-2xl">
                    <div className="mb-4 flex justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                        </span>
                    </div>

                    <h1 className="text-xl font-semibold text-white">
                        You&apos;ve been signed out
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Your session has ended and you&apos;ve been securely logged out of Auth0.
                    </p>

                    <div className="mt-8 flex flex-col gap-3">
                        <a
                            href="/login"
                            className="flex w-full items-center justify-center rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                        >
                            Sign back in
                        </a>
                        <Link
                            href="/"
                            className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
