import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifyTokenSocket } from "./middleware/authSocket";
import { getOnlineUsers, setSocketServerInstance } from "./serverStore";
import { directChatHistoryHandler } from "./socketHandlers/directChatHistoryHandler";
import { directMessageHandler } from "./socketHandlers/directMessageHandler";
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
    console.log("User connected: ", socket.id);

    newConnectionHandler(socket, io);
    emitOnlineUsers();

    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });

    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data);
    });

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, 1000 * 10);
};
