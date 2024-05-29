import mongoose, { Schema, Types } from "mongoose";
import { ObjectId } from "mongodb";
const bucketSchema = new Schema({
  title: {
    type: String,
    required: [true, "양동이 이름을 입력해주세요."],
  },
  contents: {
    type: String,
    required: [true, "양동이 정보를 입력해 주세요."],
  },
  maker: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  bucketItemList: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "BucketItem",
  },
  likeUser: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "user",
  },
});

export interface Bucket {
  title: string;
  contents: string;
  maker: Types.ObjectId;
  bucketItemList: Types.ObjectId[];
  likeUser: Types.ObjectId[];
}

export const BucketModel = mongoose.model("bucket", bucketSchema);

export const getBuckets = () => BucketModel.find();
export const getBucketListByMaker = (maker: string) =>
  BucketModel.find({ maker });
export const addNewBucket = async (bucket: Bucket) => {
  const newBucket = new BucketModel({
    title: bucket.title,
    contents: bucket.contents,
    maker: bucket.maker,
    bucketItemList: bucket.bucketItemList || [], // Optional, initialize if not provided
    likeUser: bucket.likeUser || [], // Optional, initialize if not provided
  });
  try {
    const savedBucket = await newBucket.save();
    return savedBucket;
  } catch (error) {
    console.error("Error creating bucket:", error);
    throw error;
  }
};
export const getBucketListsByFollowingUserIds = async (
  followingUserIds: string[]
) => {
  try {
    const bucketLists = await BucketModel.find({
      maker: { $in: followingUserIds },
    });
    return bucketLists;
  } catch (error) {
    console.error(
      "Error retrieving bucket lists by following user IDs:",
      error
    );
    return []; // 에러 발생 시 빈 배열 반환
  }
};
