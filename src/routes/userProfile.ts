import express, { NextFunction, Request, Response } from "express";
import {
  follow,
  getUserLikeBucketList,
  getUserProfile,
} from "../controllers/userProfile";

export default (router: express.Router) => {
  router.get("/userprofile/:userId", getUserProfile);
  router.post("/userprofile/follow/:userId", follow);
  router.get("/userprofile/likebucket/:userId", getUserLikeBucketList);
};
