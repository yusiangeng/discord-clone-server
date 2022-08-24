import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface IUserRequest extends Request {
  user?: IUser;
}

export const verifyToken = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).send("You need to log in");
  }
};
