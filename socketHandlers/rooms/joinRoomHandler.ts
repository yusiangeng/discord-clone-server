import { IUserSocket } from "../../middleware/authSocket";
import { getActiveRoom, addUserToRoom, OnlineUser } from "../../serverStore";
import { updateRooms } from "../updates/rooms";

export const joinRoomHandler = (
  socket: IUserSocket,
  data: { roomId: string }
) => {
  const participant: OnlineUser = {
    userId: socket.user!.id,
    socketId: socket.id,
  };

  const roomDetails = getActiveRoom(data.roomId);
  if (!roomDetails) return;

  addUserToRoom(data.roomId, participant);
  updateRooms();
};
