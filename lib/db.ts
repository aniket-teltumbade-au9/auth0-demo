import mongoose from "mongoose";

declare global {
    var mongooseConnection:
        | {
            conn: typeof mongoose | null;
            promise: Promise<typeof mongoose> | null;
        }
        | undefined;
}

const cached = global.mongooseConnection ?? {
    conn: null,
    promise: null
};

global.mongooseConnection = cached;

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("Missing MONGODB_URI in environment.");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(mongoUri, {
            dbName: process.env.MONGODB_DB || undefined,
            bufferCommands: false
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
