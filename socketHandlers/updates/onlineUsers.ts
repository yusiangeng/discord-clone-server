import { getOnlineUsers, getSocketServerInstance } from "../../serverStore";

/**
 * Emits event sending online users
 */
export const updateOnlineUsers = () => {
  const onlineUsers = getOnlineUsers();
  const io = getSocketServerInstance();

  io.emit("online-users", { onlineUsers });
};
