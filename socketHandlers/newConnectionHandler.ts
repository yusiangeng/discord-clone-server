import { IUserSocket } from "../middleware/authSocket";
import { addNewConnectedUser } from "../serverStore";
import {
  updateFriends,
  updateFriendsPendingInvitations,
} from "./updates/friends";
import { updateRooms } from "./updates/rooms";

export const newConnectionHandler = async (socket: IUserSocket) => {
  addNewConnectedUser({
    socketId: socket.id,
    userId: socket.user!.id,
  });

  updateFriendsPendingInvitations(socket.user!.id);
  updateFriends(socket.user!.id);

  setTimeout(() => {
    updateRooms(socket.id);
  }, 500);
};
