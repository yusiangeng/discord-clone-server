import { IUserSocket } from "../../middleware/authSocket";
import { addNewActiveRoom } from "../../serverStore";
import { updateRooms } from "../updates/rooms";

export const createRoomHandler = (socket: IUserSocket) => {
  const socketId = socket.id;
  const userId = socket.user!.id;

  const roomDetails = addNewActiveRoom(userId, socketId);

  socket.emit("create-room", {
    roomDetails,
  });

  updateRooms();
};
