import express, { Request, Response } from "express";
import { createUser, getUserByEmail } from "../models/User";
import bcrypt from "bcrypt";
import { authenticate } from "../utils/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, phone } = req.body;
    if (!email || !password || !username) {
      //에러 메세지 작성해서 보내주면 좋을듯
      console.log("dont have ", email, password, username, phone);
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await createUser({
      email,
      username,
      authentication: {
        password: hashedPassword,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log("register error", error);
    return res.sendStatus(401);
  }
};
