import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import User, { IUser } from "../models/User";

export interface IUserSocket extends Socket {
  user?: IUser;
}

export const verifyTokenSocket = async (
  socket: IUserSocket,
  next: (err?: ExtendedError | undefined) => void
) => {
  const token = socket.handshake.auth?.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    socket.user = user;
  } catch (err) {
    const socketError = new Error("NOT_AUTHORIZED");
    return next(socketError);
  }

  next();
};
