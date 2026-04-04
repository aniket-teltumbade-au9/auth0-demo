import Link from "next/link";
import { AlertTriangle } from "lucide-react";

type AuthErrorPageProps = {
    searchParams: Promise<{
        message?: string;
    }>;
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
    const params = await searchParams;

    return (
        <section className="section-shell py-20">
            <div className="mx-auto max-w-2xl glass-panel p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <h1 className="mt-6 text-3xl font-semibold text-white">Authentication callback issue</h1>
                <p className="mt-4 text-base leading-8 text-slate-300">
                    {params.message || "The Auth0 callback could not be completed. Check the environment variables and Allowed Callback URLs in the Auth0 dashboard."}
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                    >
                        Back to home
                    </Link>
                    <a
                        href="/login?returnTo=/auth-demo"
                        className="inline-flex items-center justify-center rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
                    >
                        Try login again
                    </a>
                </div>
            </div>
        </section>
    );
}
