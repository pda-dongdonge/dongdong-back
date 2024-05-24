import mongoose, { Schema } from "mongoose";

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
        ref: "UserProfile",
    },
    bucketItemList: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "BucketItem",
    },
    likeUser: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "UserProfile",
    }
});

export interface Bucket {
    title: string;
    contents: string;
    maker: string;
    // bucketItemList: string[];
    // likeUser: string[];
}

export const BucketModel = mongoose.model("bucket", bucketSchema);

export const getBuckets = () => BucketModel.find();

export const addNewBucket = (bucket: Bucket) => {
    BucketModel.create({
        title: bucket.title,
        contents: bucket.contents,
        maker: bucket.maker,
    });
}