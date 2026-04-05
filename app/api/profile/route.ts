import { NextResponse } from "next/server";

import { auth0 } from "@/lib/auth0";
import {
    getUserProfile,
    syncUserProfile,
    updateUserProfile
} from "@/lib/user-sync";

function validatePayload(payload: unknown) {
    if (!payload || typeof payload !== "object") {
        throw new Error("Invalid payload.");
    }

    const { name, bio } = payload as {
        name?: unknown;
        bio?: unknown;
    };

    if (typeof name !== "string" || name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters.");
    }

    if (typeof bio !== "string") {
        throw new Error("Bio must be a string.");
    }

    return {
        name: name.trim().slice(0, 80),
        bio: bio.trim().slice(0, 240)
    };
}

export const GET = auth0.withApiAuthRequired(async function getProfile(_req: Request) {
    const session = await auth0.getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile =
        (await getUserProfile(session.user.sub)) || (await syncUserProfile(session.user));

    return NextResponse.json({ profile });
});

export const PATCH = auth0.withApiAuthRequired(async function patchProfile(req: Request) {
    const session = await auth0.getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const payload = validatePayload(await req.json());
        const profile = await updateUserProfile(session.user.sub, payload);

        await auth0.updateSession({
            ...session,
            user: {
                ...session.user,
                name: payload.name
            }
        });

        return NextResponse.json({ profile });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Unable to update profile."
            },
            { status: 400 }
        );
    }
});