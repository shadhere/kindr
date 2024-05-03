import mongoose, { Schema, Document } from "mongoose";

interface IRefreshToken extends Document {
  userID: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
  expireAt?: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30 * 86400, // 30 days,
    },
    expireAt: {
      type: Date,
      expires: 30 * 86400, // 30 days,
    },
  },
  // { timestamps: true }, // to build createdAt & updatedAt fields automatically
  { collection: "refreshToken" }
);

const UserRefreshTokens = mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);

export default UserRefreshTokens;
