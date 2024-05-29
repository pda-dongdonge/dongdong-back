import express, { Router, Request, Response } from "express";

import {
  healthCheck,
  addNewBucket_c,
  getBucketListUrl,
  getBucket,
  getHotBucket,
  getMakerBucketList,
  getBucketDetail_c,
  getBucketUserList,
  getBucketListFollowing,
} from "../controllers/bucket";

import { BucketModel } from "../models/Bucket";
import { BucketItemModel } from "../models/BucketItem";

import { isLogin } from "../controllers/authentication";

export default (router: Router) => {
  //router.get("/bucket", healthCheck);
  router.post("/bucket", addNewBucket_c);
  router.get("/bucket", getBucket);
  router.get("/bucket/:bucketId", getBucketListUrl);
  router.get("/hotbucket", getHotBucket);
  router.get("/bucket/detail/:bucketId", getBucketDetail_c);
  router.get("/bucket/:userId", getMakerBucketList);
  router.get("/bucket/feed/:userId", getBucketListFollowing);
};
