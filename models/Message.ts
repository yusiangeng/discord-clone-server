import mongoose, { Schema } from "mongoose";

export interface IMessage extends mongoose.Document {
  authorId: string;
  content: string;
  date: Date;
  type: string;
}

const MessageSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
});

export default mongoose.model<IMessage>("Message", MessageSchema);
