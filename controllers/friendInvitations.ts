import { Response } from "express";
import { IUserRequest } from "../middleware/auth";
import FriendInvitation from "../models/FriendInvitation";
import User from "../models/User";

export const postInvite = async (req: IUserRequest, res: Response) => {
  const { targetEmail } = req.body;

  const { _id, email } = req.user!;

  if (email.toLowerCase() === targetEmail.toLowerCase()) {
    return res.status(400).send("Cannot send invitation to yourself");
  }

  const targetUser = await User.findOne({
    email: targetEmail.toLowerCase(),
  });

  if (!targetUser) {
    return res.status(404).send("No user with that email");
  }

  const existingInvitation = await FriendInvitation.findOne({
    senderId: _id,
    receiverId: targetUser._id,
  });

  if (existingInvitation) {
    return res
      .status(409)
      .send("Invitation to this user has already been sent");
  }

  const existingFriend = targetUser.friends.find(
    (friendId) => friendId.toString() === _id.toString()
  );

  if (existingFriend) {
    res.status(409).send("This user has already been added as a friend");
  }

  const newInvitation = await FriendInvitation.create({
    senderId: _id,
    receiverId: targetUser._id,
  });

  return res.status(201).send("Invitation sent!");
};
