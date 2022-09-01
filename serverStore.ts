import { Server } from "socket.io";

export type SocketId = string;

// All connected users
const connectedUsers = new Map<SocketId, { userId: string }>();

let io: Server;

export const setSocketServerInstance = (ioInstance: Server) => {
  io = ioInstance;
};

export const getSocketServerInstance = () => {
  return io;
};

export const addNewConnectedUser = ({
  socketId,
  userId,
}: {
  socketId: SocketId;
  userId: string;
}) => {
  connectedUsers.set(socketId, { userId });
  console.log("New connected users:");
  console.log(connectedUsers);
};

export const removeConnectedUser = (socketId: SocketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log("New connected users:");
    console.log(connectedUsers);
  }
};

/**
 * Returns a user's active connections. A user might be logged in on multiple devices.
 * @param userId user to check
 * @returns array of socket ids
 */
export const getActiveConnections = (userId: string) => {
  const activeConnections: SocketId[] = [];

  connectedUsers.forEach((value, key) => {
    if (value.userId == userId) {
      activeConnections.push(key);
    }
  });

  return activeConnections;
};

/**
 * Returns all user's active connections
 */
export const getOnlineUsers = () => {
  const onlineUsers: { socketId: string; userId: string }[] = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });

  return onlineUsers;
};
