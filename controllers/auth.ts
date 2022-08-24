import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.exists({ email });

    if (userExists) {
      return res.status(409).send("Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRE as string }
    );

    res.status(201).json({
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).send(err.message);
    }
    return res.status(500).send("Something went wrong, please try again later");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await bcrypt.compare(password, user.password!))) {
      return res.status(400).send("Invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRE as string }
    );

    return res.status(200).json({
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).send(err.message);
    }
    return res.status(500).send("Something went wrong, please try again later");
  }
};
