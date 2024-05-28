import express, {Request, Response, NextFunction} from "express";
import { getBuckets, addNewBucket } from "../models/Bucket";
import { Bucket } from "../models/Bucket";
import { UserModel } from "../models/User";
import { BucketModel } from "../models/Bucket";
import { getUserBySessionToken } from "../models/User";
export const healthCheck = (req: Request, res: Response) => {
    return res.send("healthy");
}

export const addNewBucket_c = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const token = req.cookies["AUTH-TOKEN"];
    if (!token) {
      throw Error("no token");
    }
    const user = await getUserBySessionToken(token);
    const {title, contents} = req.body;
    if(!title || !contents ) {
        res.sendStatus(400).json({
            message: "잘못된 입력값..(이런식으로)"
        })
    }
    try {
            if (!user) {
                return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
            }
            const newBucket = {
                title: title,
                contents: contents,
                maker:user._id,
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