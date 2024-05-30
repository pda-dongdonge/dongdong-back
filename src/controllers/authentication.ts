import { createUserProfile } from "./../models/UserProfile";
import { Request, Response } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserBySessionToken,
} from "../models/User";
import bcrypt from "bcrypt";

const tokenMaxAge = 60 * 60 * 24 * 3;
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, phone } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ error: "wrong register format" });
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
      phone,
      authentication: {
        password: hashedPassword,
      },
    });
    const userProfile = await createUserProfile({
      userId: user._id,
      followers: [],
      following: [],
      likedBucket: [],
      username: user.username,
    });

    const newUser = await getUserByEmail(email).select(
      "+authentication.password"
    );
    if (!newUser?.authentication) throw Error("cant find user");

    newUser.authentication.sessionToken = await bcrypt.hash(
      newUser._id.toString(),
      salt
    );
    await newUser.save();

    req.session.user = { id: newUser._id.toString() };
    res.cookie("AUTH-TOKEN", newUser.authentication.sessionToken, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
      secure: false,
      sameSite: false,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log("register error", error);
    return res.sendStatus(401);
  }
};

export const emailVerifyCheck = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(200).json({ email: email, verify: false });
    } else {
      return res.status(200).json({ email: email, verify: true });
    }
  } catch (error) {
    console.log("email verify check error", error);
    return res.sendStatus(401);
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUserByEmail(email).select("+authentication.password");
    if (!user) {
      return res.sendStatus(400);
    }
    if (!user.authentication) {
      throw new Error("User authentication not found");
    }
    const isMatch = await bcrypt.compare(
      password,
      user.authentication.password
    );
    if (!isMatch) {
      throw Error("incorrect user info");
    }

    const salt = await bcrypt.genSalt();
    user.authentication.sessionToken = await bcrypt.hash(
      user._id.toString(),
      salt
    );
    await user.save();
    req.session.user = { id: user._id.toString() };
    res.cookie("AUTH-TOKEN", user.authentication.sessionToken, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
      secure: false,
      sameSite: false,
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isLogin = async (req: Request, res: Response) => {
  try {
    //AUTH-TOKEN 쿠키를 확인하고 없으면 fail
    //있으면  getUserBySessionToken 으로 유저 찾아 정보보내주기
    const token = req.cookies["AUTH-TOKEN"];
    if (token) {
      const user = await getUserBySessionToken(token);
      if (!user) throw Error("no token");
      return res.status(200).json(user);
    }

    if (req.session.user) {
      console.log(`Hello, ${req.session.user.id}`);
      const user = await getUserById(req.session.user.id);
      if (!user) throw Error("no session");
      return res.status(200).json(user);
    }

    res.sendStatus(400);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("AUTH-TOKEN", "", {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
      secure: false,
      sameSite: false,
    });
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Logout failed");
      }
    });
    res.status(204).json({ state: "Success" });
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};
