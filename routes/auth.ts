import express from "express";
import { login, register } from "../controllers/auth";
import joi from "joi";
import expressJoiValidation from "express-joi-validation";
import verifyToken from "../middleware/auth";

const router = express.Router();

const validator = expressJoiValidation.createValidator({});

const registerSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).required(),
});

const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

router.post("/register", validator.body(registerSchema), register);
router.post("/login", validator.body(loginSchema), login);
router.get("/test", verifyToken, (req, res) => res.send("yay"));

export default router;
