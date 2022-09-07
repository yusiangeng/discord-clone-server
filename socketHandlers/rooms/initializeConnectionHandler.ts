import { IUserSocket } from "../../middleware/authSocket";
import { SocketId } from "../../types/types";

export const initializeConnectionHandler = (
  socket: IUserSocket,
  data: { connUserSocketId: SocketId }
) => {
  const initData = { connUserSocketId: socket.id };
  console.log("emitting to socket", data.connUserSocketId);
  socket.to(data.connUserSocketId).emit("conn-init", initData);
};
