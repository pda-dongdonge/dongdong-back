import express, {Request, Response, NextFunction} from "express";
import { getBuckets, addNewBucket } from "../models/Bucket";
import { Bucket } from "../models/Bucket";
import { UserModel } from "../models/User";
import { BucketModel } from "../models/Bucket";
import { getBucketDetail_d } from "../dao/bucket";

export const healthCheck = (req: Request, res: Response) => {
    return res.send("healthy");
}

export const addNewBucket_c = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const {title, contents, maker} = req.body;
    if(!title || !contents || !maker) {
        res.sendStatus(400).json({
            message: "잘못된 입력값..(이런식으로)"
        })
    }
    try {
        const user = await UserModel.findOne({ _id: maker });
            if (!user) {
                return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
            }
    
            const newBucket = {
                title: title,
                contents: contents,
                maker: user._id,
                bucketItemList: [],
                likeUser: []
            };
    
            const result = await addNewBucket(newBucket);
            return res.json(result);
    } catch (error) {
        console.error("Error creating bucket:", error);
        return res.status(500).json({ message: "서버 에러" });
    }
}

// [GET] /bucket/detail/:bucketId 요청 컨트롤러
export const getBucketDetail_c = async (req:Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    console.log(req.params);
    try {
        const { bucketId } = req.params;
        if (!bucketId) {
            return res.status(400).json({
                message: "wrong bucketId format"
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
            message: "server error"
        })
    }
}