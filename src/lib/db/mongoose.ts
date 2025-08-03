import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in environment");

declare global {
    var mongooseConn: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
}

let cached = global.mongooseConn;
if (!cached) cached = global.mongooseConn = { conn: null, promise: null };

export const connectToDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};
