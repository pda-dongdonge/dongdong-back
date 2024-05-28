import express, { Router, Request, Response } from "express";
import { healthCheck, addNewBucket_c, getBucketListUrl, getBucket } from "../controllers/bucket";

import { BucketModel } from "../models/Bucket";


export default (router: Router) => {
    //router.get("/bucket", healthCheck);
    router.post("/bucket", addNewBucket_c);

    router.get("/bucket", getBucket);
    router.get('/bucket/:bucketId', getBucketListUrl);


};
