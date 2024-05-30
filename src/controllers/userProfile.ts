import { Request, Response } from "express";
import { getUserById, getUserBySessionToken } from "../models/User";

import {
  UserProfileModel,
  getUserProfileById,
  updateUserProfileById,
} from "../models/UserProfile";
import { BucketModel } from "../models/Bucket";
//유저 아이디 받아서 해당 유저 정보 노출 isFollow: true / false (비로그인유저는 false)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userProfile = await getUserProfileById(userId);
    if (!userProfile) throw new Error(`no user ${userId}`);
    let isFollow = false;

    // 요청할 때 받은 userToken으로 user 정보 받기
    const token = req.cookies["AUTH-TOKEN"];
    let user;
    if (token) {
      user = await getUserBySessionToken(token);
      if (!user) throw Error("no token");
    } else if (req.session.user) {
      console.log(`Hello, ${req.session.user.id}`);
      user = await getUserById(req.session.user.id);
      if (!user) throw Error("no session");
    } else {
      return res.status(403).json({
        message: "로그인이 필요한 기능입니다.",
      });
    }

    if (!user) {
      // throw Error("no token");
      return res.status(403).json({
        message: "등록되지 않은 유저입니다.",
      });
    }

    if (user) {
      isFollow = (user && userProfile.followers.includes(user._id)) || false;
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

    // 요청할 때 받은 userToken으로 user 정보 받기
    const token = req.cookies["AUTH-TOKEN"];
    let loginUser;
    if (token) {
      loginUser = await getUserBySessionToken(token);
      if (!loginUser) throw Error("no token");
    } else if (req.session.user) {
      console.log(`Hello, ${req.session.user.id}`);
      loginUser = await getUserById(req.session.user.id);
      if (!loginUser) throw Error("no session");
    } else {
      return res.status(403).json({
        message: "로그인이 필요한 기능입니다.",
      });
    }

    if (!loginUser) {
      throw new Error(`no logined User`);
    }
    const loginUserProfile = await getUserProfileById(loginUser._id.toString());
    if (!loginUserProfile) {
      throw new Error(`no logined User`);
    }

    // follow & unfollow
    let updatedProfile;
    if (follow) {
      console.log(`${userProfile._id} to ${loginUser._id}`);
      updatedProfile = await updateUserProfileById(userProfile._id, {
        $push: { followers: loginUser._id },
      });
      await updateUserProfileById(loginUserProfile._id, {
        $push: { following: userId },
      });
    } else {
      updatedProfile = await updateUserProfileById(userProfile._id, {
        $pull: { followers: loginUser._id },
      });
      await updateUserProfileById(loginUserProfile._id, {
        $pull: { following: userId },
      });
    }

    if (!updatedProfile) throw Error("fail follow ");
    const response = {
      userId: updatedProfile.userId,
      followers: updatedProfile.followers,
      following: updatedProfile.following,
      likedBucket: updatedProfile.likedBucket,
      username: updatedProfile.username,
      followersCount: updatedProfile.followers.length,
      followingCount: updatedProfile.following.length,
      isFollow: follow,
    };
    res.status(200).json(response);
  } catch (err) {
    console.log("follow err", err);
    return res.status(400).json(err);
  }
};

//해당 유저가 좋아요한 버킷
export const getUserLikeBucketList = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const userProfile = await getUserProfileById(userId);
    if (!userProfile) throw new Error(`no user ${userId}`);

    const likedBucketIds = userProfile.likedBucket;

    const bucketDetailsPromises = likedBucketIds.map((bucketId) =>
      BucketModel.findById(bucketId)
        .populate("maker", "username")
        .populate("bucketItemList", "imgUrl")
        .exec()
    );

    const bucketDetails = await Promise.all(bucketDetailsPromises);

    // Filter out null results in case some buckets are not found
    const validBucketDetails = bucketDetails.filter(
      (bucket) => bucket !== null
    );

    if (validBucketDetails.length === 0) {
      return res.status(200).send([]);
    }

    res.json(validBucketDetails);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
