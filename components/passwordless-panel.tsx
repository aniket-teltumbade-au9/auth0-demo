"use client";

import { Mail, MessageSquareText } from "lucide-react";
import { useMemo, useState } from "react";

function createLoginHref(connection: string, loginHint: string, returnTo: string) {
    const params = new URLSearchParams({
        connection,
        login_hint: loginHint,
        returnTo
    });

    return `/auth/login?${params.toString()}`;
}

export function PasswordlessPanel() {
    const [email, setEmail] = useState("demo@client.com");
    const [phone, setPhone] = useState("+15551234567");

    const emailHref = useMemo(() => createLoginHref("email", email, "/settings"), [email]);
    const phoneHref = useMemo(() => createLoginHref("sms", phone, "/settings"), [phone]);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-panel p-6">
                <div className="flex items-center gap-3 text-white">
                    <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                        <Mail className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Email OTP</h3>
                        <p className="text-sm text-slate-400">Trigger Auth0 passwordless email for a low-friction demo.</p>
                    </div>
                </div>
                <label className="mt-6 block text-sm text-slate-300">
                    Email address
                    <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
                        placeholder="user@company.com"
                        type="email"
                    />
                </label>
                <a
                    href={emailHref}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                >
                    Start email OTP flow
                </a>
            </div>

            <div className="glass-panel p-6">
                <div className="flex items-center gap-3 text-white">
                    <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200">
                        <MessageSquareText className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">SMS OTP</h3>
                        <p className="text-sm text-slate-400">Use a verified phone number to initiate a clean SMS passwordless path.</p>
                    </div>
                </div>
                <label className="mt-6 block text-sm text-slate-300">
                    Mobile number
                    <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-violet-300/60"
                        placeholder="+15551234567"
                        type="tel"
                    />
                </label>
                <a
                    href={phoneHref}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-violet-300/60 hover:bg-white/5"
                >
                    Start SMS OTP flow
                </a>
            </div>
        </div>
    );
}
