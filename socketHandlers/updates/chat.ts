import Conversation from "../../models/Conversation";
import {
  getActiveConnections,
  getSocketServerInstance,
} from "../../serverStore";

/**
 * Emits event sending messages from a conversation
 *
 * @param conversationId
 * @param socketId if null, will emit to all users in conversation
 */
export const updateChatHistory = async (
  conversationId: string,
  socketId: string | null = null
) => {
  const conversation = await Conversation.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: {
      path: "authorId",
      model: "User",
      select: "_id username",
    },
  });

  if (!conversation) return;

  const io = getSocketServerInstance();

  if (socketId) {
    return io.to(socketId).emit("direct-chat-history", {
      messages: conversation.messages,
      participants: conversation.participants,
    });
  }

  conversation.participants.forEach((userId) => {
    const activeConnections = getActiveConnections(userId);

    activeConnections.forEach((socketId) => {
      io.to(socketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    });
  });
};
