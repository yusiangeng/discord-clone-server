import { Socket } from "socket.io";
import { removeConnectedUser } from "../serverStore";

export const disconnectHandler = (socket: Socket) => {
  removeConnectedUser(socket.id);
};
