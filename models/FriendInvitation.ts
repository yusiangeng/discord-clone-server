import mongoose, { Schema } from "mongoose";

export interface IFriendInvitation extends mongoose.Document {
  senderId: string;
  receiverId: string;
}

const FriendInvitationSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model<IFriendInvitation>(
  "FriendInvitation",
  FriendInvitationSchema
);
