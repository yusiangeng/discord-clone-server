import { IUserSocket } from "../../middleware/authSocket";
import { getActiveRoom, removeUserFromRoom } from "../../serverStore";
import { updateRooms } from "../updates/rooms";

export const leaveRoomHandler = (
  socket: IUserSocket,
  data: { roomId: string }
) => {
  let activeRoom = getActiveRoom(data.roomId);

  if (activeRoom) {
    removeUserFromRoom(data.roomId, socket.id);

    activeRoom = getActiveRoom(data.roomId);

    if (activeRoom) {
      activeRoom.participants.forEach((participant) => {
        socket.to(participant.socketId).emit("room-participant-left", {
          connUserSocketId: socket.id,
        });
      });
    }

    updateRooms();
  }
};
