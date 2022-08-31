import { Router } from "express";
import Joi from "joi";
import expressJoiValidation from "express-joi-validation";
import verifyToken from "../middleware/auth";
import { postInvite } from "../controllers/friendInvitations";

const router = Router();

const validator = expressJoiValidation.createValidator({});

const postFriendInvitationSchema = Joi.object({
  targetEmail: Joi.string().email(),
});

router.post(
  "/invite",
  verifyToken,
  validator.body(postFriendInvitationSchema),
  postInvite
);

export default router;
