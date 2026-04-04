import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const userSchema = new Schema(
    {
        auth0Id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        email: {
            type: String,
            default: null,
            index: true
        },
        name: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            default: ""
        },
        picture: {
            type: String,
            default: null
        },
        nickname: {
            type: String,
            default: null
        },
        primaryConnection: {
            type: String,
            required: true
        },
        connectedConnections: {
            type: [String],
            default: []
        },
        lastLoginAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export type UserRecord = InferSchemaType<typeof userSchema> & {
    _id: string;
};

export const UserModel =
    (models.User as Model<InferSchemaType<typeof userSchema>>) ||
    model("User", userSchema);
