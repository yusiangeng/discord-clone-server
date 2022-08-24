import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password?: string;
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
