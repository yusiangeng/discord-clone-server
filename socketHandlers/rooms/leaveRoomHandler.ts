import { IUserSocket } from "../../middleware/authSocket";
import { getActiveRoom, removeUserFromRoom } from "../../serverStore";
import { updateRooms } from "../updates/rooms";

export const leaveRoomHandler = (
  socket: IUserSocket,
  data: { roomId: string }
) => {
  const activeRoom = getActiveRoom(data.roomId);

  if (activeRoom) {
    removeUserFromRoom(data.roomId, socket.id);

    updateRooms();
  }
};
