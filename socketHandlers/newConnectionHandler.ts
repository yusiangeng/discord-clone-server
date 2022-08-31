import { Server } from "socket.io";
import { IUserSocket } from "../middleware/authSocket";
import { addNewConnectedUser } from "../serverStore";

export const newConnectionHandler = async (socket: IUserSocket, io: Server) => {
  addNewConnectedUser({
    socketId: socket.id,
    userId: socket.user!.id,
  });
};
