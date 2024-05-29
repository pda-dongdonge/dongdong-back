import { BucketModel, Bucket } from "../models/Bucket";
import mongoose from "mongoose";

//나중에 인터페이스 만들어서 리팩토링..
// interface BucektDetail {

// }

export const getBucketDetail_d = async (bucketId:string) => {
    try {
        console.log(mongoose.models);
        const bucketDetail = await BucketModel.findById(bucketId)
        .select('-__v')
        .populate({
            path: 'bucketItemList',
            select: '-__v',  // 각 bucketItem의 __v 필드를 제외
        })
        .populate({
            path: 'maker',
            select: '_id username'
        })
        .lean<Bucket>();

        if (bucketDetail) {
            return {
                ...bucketDetail,
                likeUser: bucketDetail.likeUser.length // likeUser를 배열의 길이로 변경
            };
        }

        return bucketDetail;
    } catch (error) {
        throw error;
    }
}