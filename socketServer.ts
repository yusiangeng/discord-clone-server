import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifyTokenSocket } from "./middleware/authSocket";
import { setSocketServerInstance } from "./serverStore";
import { createRoomHandler } from "./socketHandlers/rooms/createRoomHandler";
import { directChatHistoryHandler } from "./socketHandlers/chat/directChatHistoryHandler";
import { directMessageHandler } from "./socketHandlers/chat/directMessageHandler";
import { disconnectHandler } from "./socketHandlers/disconnectHandler";
import { joinRoomHandler } from "./socketHandlers/rooms/joinRoomHandler";
import { leaveRoomHandler } from "./socketHandlers/rooms/leaveRoomHandler";
import { newConnectionHandler } from "./socketHandlers/newConnectionHandler";
import { updateOnlineUsers } from "./socketHandlers/updates/onlineUsers";

export const registerSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  setSocketServerInstance(io);

  io.use(verifyTokenSocket);

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    newConnectionHandler(socket);
    updateOnlineUsers();

    socket.on("direct-message", (data) => {
      directMessageHandler(socket, data);
    });

    socket.on("direct-chat-history", (data) => {
      directChatHistoryHandler(socket, data);
    });

    socket.on("create-room", () => {
      createRoomHandler(socket);
    });

    socket.on("join-room", (data) => {
      joinRoomHandler(socket, data);
    });

    socket.on("leave-room", (data) => {
      leaveRoomHandler(socket, data);
    });

    socket.on("disconnect", () => {
      disconnectHandler(socket);
    });
  });

  setInterval(() => {
    updateOnlineUsers();
  }, 1000 * 15);
};
