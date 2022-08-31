const connectedUsers = new Map<string, { userId: string }>();

export const addNewConnectedUser = ({
  socketId,
  userId,
}: {
  socketId: string;
  userId: string;
}) => {
  connectedUsers.set(socketId, { userId });
  console.log("New connected users:");
  console.log(connectedUsers);
};

export const removeConnectedUser = (socketId: string) => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
    console.log("New connected users:");
    console.log(connectedUsers);
  }
};
