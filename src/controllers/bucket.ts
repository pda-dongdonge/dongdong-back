import { Request, Response, NextFunction } from "express";
import {
  BucketModel,
  getBuckets,
  addNewBucket,
  getBucketListByMaker,
  getBucketListsByFollowingUserIds,
  deleteBucket,
} from "../models/Bucket";
import { UserModel, getUserBySessionToken } from "../models/User";
import {
  getUserProfileById,
  updateUserProfileById,
} from "../models/UserProfile";
import { Bucket } from "../models/Bucket";
import { Types } from "mongoose";
import { getBucketDetail_d } from "../dao/bucket";

export const healthCheck = (req: Request, res: Response) => {
  return res.send("healthy");
};

export const addNewBucket_c = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const token = req.cookies["AUTH-TOKEN"];
  if (!token) {
    throw Error("no token");
  }
  const user = await getUserBySessionToken(token);
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.sendStatus(400).json({
      message: "잘못된 입력값..(이런식으로)",
    });
  }
  try {
    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }
    const newBucket = {
      title: title,
      contents: contents,
      maker: user._id,
      bucketItemList: [],
      likeUser: [],
    };

    const result = await addNewBucket(newBucket);
    return res.json(result);
  } catch (error) {
    console.error("Error creating bucket:", error);
    return res.status(500).json({ message: "서버 에러" });
  }
};

export const getBucket = async (req: Request, res: Response) => {
  try {
    const result = await BucketModel.find()
      .populate("maker", "username")
      .populate("bucketItemList", "imgUrl")
      .exec();
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getBucketListUrl = async (req: Request, res: Response) => {
  const { bucketId } = req.params;

  try {
    const result = await BucketModel.findOne({ _id: bucketId }).populate(
      //path:
      "bucketItemList",
      "imgUrl"
      //select: 'imgUrl' // imgUrl 필드만 선택
    );
    //.exec();
    if (!result) {
      return res.status(404).send("Bucket not found");
    }
    res.json(result.bucketItemList);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getHotBucket = async (req: Request, res: Response) => {
  try {
    const result = await BucketModel.aggregate([
      {
        $addFields: {
          likeUserCount: { $size: { $ifNull: ["$likeUser", []] } },
        },
      },
      {
        $sort: { likeUserCount: -1 },
      },
    ]).exec();
    const populatedResult = await BucketModel.populate(result, {
      path: "maker",
      select: "username",
    });

    res.json(populatedResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// [GET] /bucket/detail/:bucketId 요청 컨트롤러
export const getBucketDetail_c = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.body);
  console.log(req.params);
  try {
    const { bucketId } = req.params;
    if (!bucketId) {
      return res.status(400).json({
        message: "wrong bucketId format",
      });
    }

    // bucket bucketItem 목록 받기 (userProfile은 아직 미완, user정보 없음 아직)
    const bucketDetail = await getBucketDetail_d(bucketId);
    console.log(bucketDetail);

    return res.json(bucketDetail);

    // 그 값 보내기 -> 좋아요는 length로 좋아요 수 보내는거
  } catch (error) {
    console.log("getBucketDetail_c error : ", error);
    return res.status(500).json({
      message: "server error",
    });
  }
};

export const getBucketUserList = async (req: Request, res: Response) => {
  const { bucketId } = req.params;

  try {
    const result = await BucketModel.findById({ _id: bucketId })
      .populate("maker")
      .exec();
    if (!result) {
      return res.status(404).send("Bucket not found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getMakerBucketList = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await getBucketListByMaker(userId);
    if (!result) {
      return res.status(404).send("Bucket not found");
    }
    res.json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getBucketListFollowing = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    //해당 유저의 팔로잉 조회
    const user = await getUserProfileById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    //팔로잉 한 유저들의 버켓 조회
    const bucketList = await getBucketListsByFollowingUserIds(
      user.following.map(String)
    );
    res.json(bucketList);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("fail to get bucket List you follow");
  }
};

export const getUserBuckets = async (req: Request, res: Response) => {
  // console.log(req.body);
  // const token = req.cookies["AUTH-TOKEN"];
  // if (!token) {
  //   throw Error("no token");
  // }
  // const user = await getUserBySessionToken(token);
  //유저의 버킷리스트 불러오는 로직 추가
  try {
    const result = await getBuckets();
    res.json(result);
  } catch (error) {
    console.error("버킷을 가져오는 중 오류 발생:");
    res.status(500).send("서버 내부 오류");
  }
};

export const removeBucket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bucketId = req.params.bucketId; // Extract bucketId from request parameters
  try {
    if (!Types.ObjectId.isValid(bucketId)) {
      return res.status(400).json({ message: "Invalid bucket ID" });
    }
    const result = await deleteBucket(new Types.ObjectId(bucketId));
    return res.json(result);
  } catch (error) {
    console.error("Error deleting bucket:", error);
    return res.status(500).json({ message: "서버 에러" });
  }
};
