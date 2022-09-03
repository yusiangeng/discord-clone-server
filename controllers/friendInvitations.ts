import { Response } from "express";
import { IUserRequest } from "../middleware/auth";
import FriendInvitation from "../models/FriendInvitation";
import User from "../models/User";
import {
  updateFriends,
  updateFriendsPendingInvitations,
} from "../socketHandlers/updates/friends";

export const postInvite = async (req: IUserRequest, res: Response) => {
  try {
    const { targetEmail } = req.body;
    const { _id, email } = req.user!;

    if (email.toLowerCase() === targetEmail.toLowerCase()) {
      return res.status(400).send("Cannot send invitation to yourself!");
    }

    const targetUser = await User.findOne({
      email: targetEmail.toLowerCase(),
    });

    if (!targetUser) {
      return res.status(404).send("No user found with that email!");
    }

    const existingInvitation = await FriendInvitation.findOne({
      senderId: _id,
      receiverId: targetUser._id,
    });

    if (existingInvitation) {
      return res
        .status(409)
        .send("You have already sent an invitation to this user!");
    }

    const existingInvitationFlipped = await FriendInvitation.findOne({
      senderId: targetUser._id,
      receiverId: _id,
    });

    if (existingInvitationFlipped) {
      return res
        .status(409)
        .send("This user has already sent you an invitation!");
    }

    const existingFriend = targetUser.friends.find(
      (friendId) => friendId.toString() === _id.toString()
    );

    if (existingFriend) {
      return res
        .status(409)
        .send("This user has already been added as a friend!");
    }

    const newInvitation = await FriendInvitation.create({
      senderId: _id,
      receiverId: targetUser._id,
    });

    updateFriendsPendingInvitations(targetUser.id);

    return res.status(201).send("Invitation sent successfully!");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong, try again later");
  }
};

export const postAccept = async (req: IUserRequest, res: Response) => {
  try {
    const { id } = req.body;

    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      return res.status(404).send("Invitation not found");
    }

    const { senderId, receiverId } = invitation;

    // update friends on Users
    const senderUser = await User.findById(senderId);
    const receiverUser = await User.findById(receiverId);
    if (!senderUser || !receiverUser) {
      return res.status(404).send("User not found");
    }
    senderUser.friends = [...senderUser.friends, receiverId];
    receiverUser.friends = [...receiverUser.friends, senderId];
    await senderUser.save();
    await receiverUser.save();

    // delete invitation
    await FriendInvitation.findByIdAndDelete(id);

    updateFriendsPendingInvitations(receiverId);
    updateFriends(receiverId);
    updateFriends(senderId);

    return res.status(200).send("Friend added successfully!");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong, try again later");
  }
};

export const postReject = async (req: IUserRequest, res: Response) => {
  try {
    const { id } = req.body;
    const { _id: userId } = req.user!;

    const invitationExists = await FriendInvitation.exists({ _id: id });

    if (!invitationExists) {
      return res.status(404).send("Invitation not found");
    }

    await FriendInvitation.findByIdAndDelete(id);

    updateFriendsPendingInvitations(userId);

    return res.status(200).send("Invitation rejected successfully!");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong, try again later");
  }
};
