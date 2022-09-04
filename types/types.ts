export type SocketId = string;

export type RoomId = string;

export interface OnlineUser {
  userId: string;
  socketId: SocketId;
}

export interface ActiveRoom {
  roomId: string;
  roomCreator: OnlineUser;
  participants: OnlineUser[];
}
