import { getActiveRooms, getSocketServerInstance } from "../../serverStore";
import { SocketId } from "../../types/types";

/**
 * Emits event sending active rooms
 *
 * @param socketId if null, will emit to all users
 */
export const updateRooms = (socketId?: SocketId) => {
  const io = getSocketServerInstance();
  const activeRooms = getActiveRooms();

  if (socketId) {
    io.to(socketId).emit("active-rooms", {
      activeRooms,
    });
  } else {
    io.emit("active-rooms", {
      activeRooms,
    });
  }
};
