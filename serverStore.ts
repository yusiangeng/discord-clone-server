import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { ActiveRoom, OnlineUser, RoomId, SocketId } from "./types/types";

// all connected users
const connectedUsers = new Map<SocketId, { userId: string }>();

// all active rooms
const activeRooms = new Map<RoomId, ActiveRoom>();

let io: Server;

export const setSocketServerInstance = (ioInstance: Server) => {
  io = ioInstance;
};

export const getSocketServerInstance = () => {
  return io;
};

/**
 * Adds a connected user to the server store.
 */
export const addNewConnectedUser = ({
  socketId,
  userId,
}: {
  socketId: SocketId;
  userId: string;
}) => {
  connectedUsers.set(socketId, { userId });
  console.log("Connected users:", connectedUsers);
};

/**
 * Removes a connected user from the server store.
 */
export const removeConnectedUser = (socketId: SocketId) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log("Connected users:", connectedUsers);
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
 * Returns active connections of all users.
 */
export const getOnlineUsers = () => {
  const onlineUsers: { socketId: SocketId; userId: string }[] = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });

  return onlineUsers;
};

/**
 * Creates a new active room and adds it to the server store.
 */
export const addNewActiveRoom = (userId: string, socketId: SocketId) => {
  const newRoom = {
    roomId: uuidv4(),
    roomCreator: {
      userId,
      socketId,
    },
    participants: [
      {
        userId,
        socketId,
      },
    ],
  };

  activeRooms.set(newRoom.roomId, newRoom);
  console.log("Active rooms:", activeRooms);

  return newRoom;
};

/**
 * Returns an array of all active rooms in the server store.
 */
export const getActiveRooms = () => {
  return [...activeRooms.values()];
};

/**
 * Returns an active room from the server store.
 */
export const getActiveRoom = (roomId: RoomId) => {
  const room = activeRooms.get(roomId);
  return room;
};

/**
 * Adds a user to an active room in the server store.
 */
export const addUserToRoom = (roomId: RoomId, newParticipant: OnlineUser) => {
  const room = activeRooms.get(roomId);
  if (!room || room.participants.length >= 4) return;

  room.participants.push(newParticipant);
  console.log("Room", roomId, "participants:", room.participants);
};

/**
 * Removes a user from an active room in the server store.
 * Deletes the room if there are no more participants after removing the user.
 */
export const removeUserFromRoom = (roomId: RoomId, socketId: SocketId) => {
  const room = activeRooms.get(roomId);
  if (!room) return;

  room.participants = room.participants.filter(
    (participant) => participant.socketId !== socketId
  );
  console.log("Room", roomId, "participants:", room.participants);

  if (room.participants.length === 0) {
    activeRooms.delete(roomId);
  }
};
