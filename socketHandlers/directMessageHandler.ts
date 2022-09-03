import { IUserSocket } from "../middleware/authSocket";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { updateChatHistory } from "./updates/chat";

export const directMessageHandler = async (
  socket: IUserSocket,
  data: { receiverUserId: string; content: string }
) => {
  try {
    const { id } = socket.user!;
    const { receiverUserId, content } = data;

    const message = await Message.create({
      content,
      authorId: id,
      date: new Date(),
      type: "DIRECT",
    });

    const conversation = await Conversation.findOne({
      participants: { $all: [id, receiverUserId] },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      updateChatHistory(conversation.id);
    } else {
      const newConversation = await Conversation.create({
        participants: [id, receiverUserId],
        messages: [message._id],
      });

      updateChatHistory(newConversation.id);
    }
  } catch (err) {
    console.log(err);
  }
};
