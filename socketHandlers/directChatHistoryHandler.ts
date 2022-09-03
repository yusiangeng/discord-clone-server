import { IUserSocket } from "../middleware/authSocket";
import Conversation from "../models/Conversation";
import { updateChatHistory } from "./updates/chat";

export const directChatHistoryHandler = async (
  socket: IUserSocket,
  data: { receiverUserId: string }
) => {
  try {
    const { id } = socket.user!;
    const { receiverUserId } = data;

    const conversation = await Conversation.findOne({
      participants: { $all: [id, receiverUserId] },
    });

    if (conversation) {
      updateChatHistory(conversation.id, socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};
