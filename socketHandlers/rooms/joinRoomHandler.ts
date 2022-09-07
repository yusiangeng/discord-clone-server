import { IUserSocket } from "../../middleware/authSocket";
import { getActiveRoom, addUserToRoom } from "../../serverStore";
import { OnlineUser } from "../../types/types";
import { updateRooms } from "../updates/rooms";

export const joinRoomHandler = (
  socket: IUserSocket,
  data: { roomId: string }
) => {
  const newParticipant: OnlineUser = {
    userId: socket.user!.id,
    socketId: socket.id,
  };

  const roomDetails = getActiveRoom(data.roomId);
  if (!roomDetails) return;

  addUserToRoom(data.roomId, newParticipant);

  // emit event to other users in room
  roomDetails.participants.forEach((participant) => {
    if (participant.socketId !== newParticipant.socketId) {
      socket.to(participant.socketId).emit("conn-prepare", {
        connUserSocketId: newParticipant.socketId,
      });
    }
  });

  updateRooms();
};
