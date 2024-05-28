import mongoose, { Schema, Types } from "mongoose";

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
    maker: Types.ObjectId;
    bucketItemList: Types.ObjectId[];
    likeUser: Types.ObjectId[];
}


export const BucketModel = mongoose.model("Bucket", bucketSchema);

export const getBuckets = async () => {
    try {
        const buckets = await BucketModel.find();
        console.log(buckets);
        return buckets;
    } catch (error) {
        console.error("Error fetching buckets:", error);
        throw error;
    }
};

export const addNewBucket = async (bucket: Bucket) => {
    const newBucket = new BucketModel({
        title: bucket.title,
        contents: bucket.contents,
        maker: bucket.maker,
        bucketItemList: bucket.bucketItemList || [],  // Optional, initialize if not provided
        likeUser: bucket.likeUser || []              // Optional, initialize if not provided
    });
    try {
        const savedBucket = await newBucket.save();
        return savedBucket;
    } catch (error) {
        console.error("Error creating bucket:", error);
        throw error;
    }
}