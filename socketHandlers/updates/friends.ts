import FriendInvitation from "../../models/FriendInvitation";
import User from "../../models/User";
import {
  getActiveConnections,
  getSocketServerInstance,
} from "../../serverStore";

/**
 * Emits event sending a user's pending friend invitations
 * @param userId id of user to update
 */
export const updateFriendsPendingInvitations = async (userId: string) => {
  try {
    const receiverList = getActiveConnections(userId);
    if (receiverList.length === 0) return;

    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id username email");

    const io = getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-invitations", {
        pendingInvitations: pendingInvitations ?? [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Emits event sending a user's friends
 * @param userId id of user to update
 */
export const updateFriends = async (userId: string) => {
  try {
    const receiverList = getActiveConnections(userId);
    if (receiverList.length === 0) return;

    const user = await User.findById(userId, {
      _id: true,
      friends: true,
    }).populate("friends", "_id username email");

    if (!user) return;

    const friendsList = user.friends.map((friend: any) => ({
      id: friend._id,
      email: friend.email,
      username: friend.username,
    }));

    const io = getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit("friends-list", {
        friends: friendsList,
      });
    });
  } catch (err) {
    console.log(err);
  }
};
