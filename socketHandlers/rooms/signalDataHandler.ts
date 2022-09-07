import { IUserSocket } from "../../middleware/authSocket";
import { SignalData } from "../../types/types";

export const signalDataHandler = (socket: IUserSocket, data: SignalData) => {
  const { connUserSocketId, signal } = data;

  const signalData: SignalData = { signal, connUserSocketId: socket.id };
  socket.to(connUserSocketId).emit("conn-signal", signalData);
};
