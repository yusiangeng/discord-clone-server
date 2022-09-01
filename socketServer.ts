import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifyTokenSocket } from "./middleware/authSocket";
import { getOnlineUsers, setSocketServerInstance } from "./serverStore";
import { disconnectHandler } from "./socketHandlers/disconnectHandler";
import { newConnectionHandler } from "./socketHandlers/newConnectionHandler";

// interface ServerToClientEvents {
//   noArg: () => void;
//   basicEmit: (a: number, b: string, c: Buffer) => void;
//   withAck: (d: string, callback: (e: number) => void) => void;
// }

// interface ClientToServerEvents {
//   hello: () => void;
// }

// interface InterServerEvents {
//   ping: () => void;
// }

// interface SocketData {
//   name: string;
//   age: number;
// }

export const registerSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setSocketServerInstance(io);

  io.use(verifyTokenSocket);

  const emitOnlineUsers = () => {
    const onlineUsers = getOnlineUsers();
    io.emit("online-users", { onlineUsers });
  };

  io.on("connection", (socket) => {
    console.log("user connected");
    console.log(socket.id);

    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 1000 * 10);
};
