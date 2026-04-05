"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/* ─── Brand icons ─────────────────────────────────────────────────── */
function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
            <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
        </svg>
    );
}

/* ─── Reusable sub-components ─────────────────────────────────────── */
function SocialButton({
    icon,
    label,
    loading,
    disabled,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    loading: boolean;
    disabled: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition",
                "hover:border-white/20 hover:bg-white/10",
                "disabled:cursor-not-allowed disabled:opacity-50"
            )}
        >
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : icon}
            {label}
        </button>
    );
}

function Divider() {
    return (
        <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">or continue with email</span>
            <div className="h-px flex-1 bg-white/10" />
        </div>
    );
}

/* ─── Popup hook ──────────────────────────────────────────────────── */
function useAuthPopup(returnTo: string) {
    const [loading, setLoading] = useState<string | null>(null);

    const open = useCallback(
        (connection: string) => {
            setLoading(connection);

            // Popup completes → lands on /auth-callback-popup which postMessages back
            const popupReturnTo = "/auth-callback-popup";
            const url = `/auth/login?connection=${connection}&returnTo=${encodeURIComponent(popupReturnTo)}`;

            const w = 500,
                h = 660;
            const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
            const top = Math.round(window.screenY + (window.outerHeight - h) / 2);

            const popup = window.open(
                url,
                "auth0-popup",
                `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );

            if (!popup || popup.closed) {
                // Popup blocked — fall back to full redirect
                window.location.href = url;
                setLoading(null);
                return;
            }

            function onMessage(e: MessageEvent) {
                if (e.origin !== window.location.origin) return;
                if (e.data?.type === "auth0_popup_complete") {
                    cleanup();
                    window.location.assign(returnTo || "/settings");
                }
            }

            function cleanup() {
                clearInterval(poll);
                window.removeEventListener("message", onMessage);
                setLoading(null);
            }

            const poll = setInterval(() => {
                if (popup.closed) cleanup();
            }, 500);

            window.addEventListener("message", onMessage);
        },
        [returnTo]
    );

    return { loading, open };
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function LoginPage() {
    const searchParams = useSearchParams();
    const returnTo = searchParams.get("returnTo") ?? "/settings";

    const { loading: popupLoading, open: openPopup } = useAuthPopup(returnTo);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const busy = !!popupLoading || submitting;

    function handleEmailSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed) {
            setEmailError("Please enter your email address.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setEmailError("");
        setSubmitting(true);
        const params = new URLSearchParams({
            connection: "email",
            login_hint: trimmed,
            returnTo,
        });
        window.location.href = `/auth/login?${params}`;
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-16">
            <div className="w-full max-w-[400px]">
                {/* Brand mark */}
                <div className="mb-8 flex flex-col items-center gap-4 text-center">
                    <Link
                        href="/"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-glow transition hover:scale-105"
                    >
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Welcome back
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Sign in to your Auth0 Demo account
                        </p>
                    </div>
                </div>

                <div className="glass-panel px-8 py-8 shadow-2xl">
                    {/* Social buttons */}
                    <div className="space-y-3">
                        <SocialButton
                            icon={<GoogleIcon />}
                            label="Continue with Google"
                            loading={popupLoading === "google-oauth2"}
                            disabled={busy}
                            onClick={() => openPopup("google-oauth2")}
                        />
                        <SocialButton
                            icon={<FacebookIcon />}
                            label="Continue with Facebook"
                            loading={popupLoading === "facebook"}
                            disabled={busy}
                            onClick={() => openPopup("facebook")}
                        />
                    </div>

                    <Divider />

                    {/* Email passwordless form */}
                    <form onSubmit={handleEmailSubmit} noValidate className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-200"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError("");
                                    }}
                                    className={cn(
                                        "w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 outline-none transition",
                                        "focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
                                        emailError
                                            ? "border-red-500/70"
                                            : "border-white/10"
                                    )}
                                />
                            </div>
                            {emailError && (
                                <p className="text-xs text-red-400">{emailError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={busy}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : null}
                            Continue with email
                            {!submitting && <ArrowRight className="h-4 w-4" />}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-medium text-violet-400 transition hover:text-violet-300"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </main>
    );
}
