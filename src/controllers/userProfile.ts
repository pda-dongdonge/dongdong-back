import { Request, Response } from "express";
import { getUserById, getUserBySessionToken } from "../models/User";
import {
  getUserProfileById,
  updateUserProfileById,
} from "../models/UserProfile";
//유저 아이디 받아서 해당 유저 정보 노출 isFollow: true / false (비로그인유저는 false)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userProfile = await getUserProfileById(userId);
    if (!userProfile) throw new Error(`no user ${userId}`);

    const token = req.cookies["AUTH-TOKEN"];
    let isFollow = false;
    if (token) {
      const loginUser = await getUserBySessionToken(token);
      isFollow =
        (loginUser && userProfile.followers.includes(loginUser._id)) || false;
    }

    const response = {
      userId: userProfile.userId,
      followers: userProfile.followers,
      following: userProfile.following,
      likedBucket: userProfile.likedBucket,
      username: userProfile.username,
      followersCount: userProfile.followers.length,
      followingCount: userProfile.following.length,
      isFollow,
    };
    return res.json(response);
  } catch (err) {
    console.log("user profile err : ", err);
    return res.status(400).json(err);
  }
};

// follow&unfollow
export const follow = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { follow } = req.body; //
    const userProfile = await getUserProfileById(userId);
    if (!userProfile) throw new Error();
    const token = req.cookies["AUTH-TOKEN"];
    if (!token) {
      throw new Error(`no token`);
    }
    const loginUser = await getUserBySessionToken(token);
    if (!loginUser) {
      throw new Error(`no logined User`);
    }

    const newFollowers = [...userProfile?.followers];
    if (follow) {
      newFollowers.push(loginUser._id);
    } else {
      newFollowers.filter((el) => el !== loginUser._id);
    }

    await updateUserProfileById(userId, { follows: newFollowers });
    res.status(200).json({ state: "success" });
  } catch (err) {
    console.log("follow err", err);
    return res.status(400).json(err);
  }
};
