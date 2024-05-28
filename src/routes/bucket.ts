import express, { Router, Request, Response } from "express";
import { healthCheck, addNewBucket_c, getBucketDetail_c } from "../controllers/bucket";
import { BucketModel } from "../models/Bucket";
import { BucketItemModel } from "../models/BucketItem";


export default (router: Router) => {
    //router.get("/bucket", healthCheck);
    router.post("/bucket", addNewBucket_c);

    router.get("/bucket", async (req: Request, res: Response) => {
        try {
            const result = await BucketModel.find();
            res.json(result);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    router.get("/bucket/detail/:bucketId", getBucketDetail_c);
};
