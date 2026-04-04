"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProfileFormProps = {
    initialName: string;
    initialBio: string;
    email?: string | null;
};

export function ProfileForm({ initialName, initialBio, email }: ProfileFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [bio, setBio] = useState(initialBio);
    const [status, setStatus] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setStatus(null);

        try {
            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ name, bio })
            });

            if (!response.ok) {
                const payload = (await response.json()) as { error?: string };
                throw new Error(payload.error || "Unable to save profile.");
            }

            setStatus("Saved to MongoDB and refreshed the Auth0 session.");
            router.refresh();
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Unable to save profile.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-6">
            <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Editable account details</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                    This section reads from MongoDB and writes back through a protected App Router API route.
                </p>
            </div>

            <div className="mt-8 grid gap-5">
                <label className="text-sm text-slate-300">
                    Name
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
                        maxLength={80}
                        required
                    />
                </label>

                <label className="text-sm text-slate-300">
                    Bio
                    <textarea
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
                        maxLength={240}
                    />
                </label>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
                    Auth0 email: <span className="font-medium text-white">{email || "Not available"}</span>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {saving ? "Saving..." : "Save profile"}
                </button>
                {status ? <p className="text-sm text-slate-300">{status}</p> : null}
            </div>
        </form>
    );
}
