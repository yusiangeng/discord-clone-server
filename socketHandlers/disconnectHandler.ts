import { Socket } from "socket.io";
import { getActiveRooms, removeConnectedUser } from "../serverStore";
import { leaveRoomHandler } from "./rooms/leaveRoomHandler";
import { updateOnlineUsers } from "./updates/onlineUsers";

export const disconnectHandler = (socket: Socket) => {
  const activeRooms = getActiveRooms();

  activeRooms.forEach((room) => {
    const userInRoom = room.participants.some(
      (participant) => participant.socketId === socket.id
    );

    if (userInRoom) {
      leaveRoomHandler(socket, { roomId: room.roomId });
    }
  });

  removeConnectedUser(socket.id);
  updateOnlineUsers();
};
