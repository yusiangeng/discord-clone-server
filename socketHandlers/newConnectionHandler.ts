import { Server } from "socket.io";
import { IUserSocket } from "../middleware/authSocket";
import { addNewConnectedUser } from "../serverStore";
import {
  updateFriends,
  updateFriendsPendingInvitations,
} from "./updates/friends";

export const newConnectionHandler = async (socket: IUserSocket, io: Server) => {
  addNewConnectedUser({
    socketId: socket.id,
    userId: socket.user!.id,
  });

  // emit events
  updateFriendsPendingInvitations(socket.user!.id);
  updateFriends(socket.user!.id);
};
