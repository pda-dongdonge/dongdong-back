import express, {Request, Response, NextFunction} from "express";
import { getBuckets, addNewBucket } from "../models/Bucket";
import { Bucket } from "../models/Bucket";
import { UserModel } from "../models/User";
import { BucketModel } from "../models/Bucket";

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
        UserModel.findOne({_id:maker}).then((user)=>{
            BucketModel.create({
                title: title,
                contents: contents,
                maker: user
            })
            .then((result)=>{
                res.json(result);
            })
            .catch(e=>{
                res.json(e);
            })
        })
        // const result = await addNewBucket({ title, contents, maker });
        // console.log(result);
        // return res.json(result);
    } catch (error) {
        console.error("Error creating bucket:", error);
        return res.status(500).json({ message: "서버 에러" });
    }
}