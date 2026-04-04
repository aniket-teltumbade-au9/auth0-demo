"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

/**
 * Landing page for the social-login popup window.
 *
 * Flow:
 *  1. Parent page opens /auth/login?connection=google-oauth2&returnTo=/auth-callback-popup
 *  2. Auth0 completes OAuth, SDK sets session cookie, redirects here
 *  3. This page sends a postMessage to the opener and closes itself
 *  4. The opener receives the message, closes the popup, and navigates
 */
export default function AuthCallbackPopupPage() {
    const router = useRouter();

    useEffect(() => {
        try {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage(
                    { type: "auth0_popup_complete" },
                    window.location.origin
                );
                // Brief delay so the message is received before the window is gone
                setTimeout(() => {
                    try {
                        window.close();
                    } catch {
                        // In some browsers window.close() is blocked if the window
                        // wasn't opened by script — fall back to redirecting.
                        router.replace("/auth-demo");
                    }
                }, 300);
            } else {
                // Not running inside a popup — navigate directly
                router.replace("/auth-demo");
            }
        } catch {
            router.replace("/auth-demo");
        }
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="flex flex-col items-center gap-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-glow">
                    <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <div>
                    <p className="text-base font-medium text-white">Signing you in…</p>
                    <p className="mt-1 text-sm text-slate-400">
                        This window will close automatically.
                    </p>
                </div>
                {/* Animated ring */}
                <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-violet-500/40 border-t-violet-400" />
            </div>
        </main>
    );
}
