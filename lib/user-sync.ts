import { connectToDatabase } from "@/lib/db";
import { UserModel, type UserRecord } from "@/lib/models/user";

type SessionUser = {
    sub: string;
    email?: string | null;
    name?: string | null;
    nickname?: string | null;
    picture?: string | null;
};

type SyncUserOptions = {
    connectedAccount?: {
        connection?: string | null;
        provider?: string | null;
    } | null;
};

type UpdateProfileInput = {
    name: string;
    bio: string;
};

function getPrimaryConnection(sub: string) {
    return sub.split("|")[0] ?? "auth0";
}

function normalizeConnection(value: string) {
    const normalized = value.trim().toLowerCase();
    return normalized === "x" ? "twitter" : normalized;
}

function getSafeName(user: SessionUser) {
    return user.name || user.nickname || user.email || "Auth0 Demo User";
}

function buildConnections(
    user: SessionUser,
    existingConnections: string[] = [],
    options?: SyncUserOptions
) {
    const connectionSet = new Set(
        existingConnections.filter(Boolean).map(normalizeConnection)
    );

    connectionSet.add(normalizeConnection(getPrimaryConnection(user.sub)));

    const linkedConnection =
        options?.connectedAccount?.connection || options?.connectedAccount?.provider;

    if (linkedConnection) {
        connectionSet.add(normalizeConnection(linkedConnection));
    }

    return Array.from(connectionSet).sort();
}

function toPlainUserRecord(record: UserRecord | null) {
    if (!record) {
        return null;
    }

    return {
        ...record,
        _id: String(record._id)
    };
}

export async function syncUserProfile(
    user: SessionUser,
    options?: SyncUserOptions
) {
    await connectToDatabase();

    const existing = await UserModel.findOne({ auth0Id: user.sub }).lean<UserRecord | null>();
    const connectedConnections = buildConnections(
        user,
        existing?.connectedConnections,
        options
    );

    const updated = await UserModel.findOneAndUpdate(
        { auth0Id: user.sub },
        {
            $set: {
                email: user.email ?? null,
                name: getSafeName(user),
                picture: user.picture ?? null,
                nickname: user.nickname ?? null,
                primaryConnection: getPrimaryConnection(user.sub),
                connectedConnections,
                lastLoginAt: new Date()
            },
            $setOnInsert: {
                bio: ""
            }
        },
        {
            new: true,
            upsert: true,
            lean: true
        }
    );

    return toPlainUserRecord(updated as UserRecord | null);
}

export async function getUserProfile(auth0Id: string) {
    await connectToDatabase();
    const record = await UserModel.findOne({ auth0Id }).lean<UserRecord | null>();
    return toPlainUserRecord(record);
}

export async function updateUserProfile(auth0Id: string, input: UpdateProfileInput) {
    await connectToDatabase();

    const updated = await UserModel.findOneAndUpdate(
        { auth0Id },
        {
            $set: {
                name: input.name,
                bio: input.bio
            }
        },
        {
            new: true,
            lean: true
        }
    );

    return toPlainUserRecord(updated as UserRecord | null);
}
