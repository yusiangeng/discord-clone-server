import mongoose, { Schema } from "mongoose";

export interface IConversation extends mongoose.Document {
  participants: string[];
  messages: string[];
}

const ConversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

export default mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
