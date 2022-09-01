import { Router } from "express";
import Joi from "joi";
import expressJoiValidation from "express-joi-validation";
import verifyToken from "../middleware/auth";
import {
  postAccept,
  postInvite,
  postReject,
} from "../controllers/friendInvitations";

const router = Router();

const validator = expressJoiValidation.createValidator({});

const postFriendInvitationSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});
const inviteDecisionSchema = Joi.object({
  id: Joi.string().required(),
});

router.post(
  "/invite",
  verifyToken,
  validator.body(postFriendInvitationSchema),
  postInvite
);

router.post(
  "/accept",
  verifyToken,
  validator.body(inviteDecisionSchema),
  postAccept
);

router.post(
  "/reject",
  verifyToken,
  validator.body(inviteDecisionSchema),
  postReject
);

export default router;
