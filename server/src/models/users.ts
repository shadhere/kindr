import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  group: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    group: {
      type: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // to build createdAt & updatedAt fields automatically
);

const Users: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default Users;
