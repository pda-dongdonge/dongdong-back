import { Router } from "express";
import {
  addNewBucket_c,
  getBucketListUrl,
  getBucket,
  getHotBucket,
  getMakerBucketList,
  getBucketDetail_c,
  getBucketListFollowing,
  getUserBuckets,
  removeBucket,
  bucketLike_c,
  isBucketLiked_c
} from "../controllers/bucket";

export default (router: Router) => {
  router.get("/bucket/feed/:userId", getBucketListFollowing);
  router.get("/bucket", getBucket);
  router.post("/bucket", addNewBucket_c);
  router.get("/bucket/:bucketId", getBucketListUrl);
  router.get("/bucket/user/:userId", getMakerBucketList);
  router.get("/hotbucket", getHotBucket);
  router.get("/bucket/detail/:bucketId", getBucketDetail_c);
  router.get("/bucket/user", getUserBuckets);
  router.delete("/bucket/user", removeBucket);
  router.patch("/bucket/like", bucketLike_c);
  router.get("/bucket/isLiked", isBucketLiked_c);
};
