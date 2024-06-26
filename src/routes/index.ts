import express from "express";
import authentication from "./authentication";
import bucket from "./bucket";
import bucketItem from "./bucketItem";
import userProfile from "./userProfile";
const router = express.Router();

export default (): express.Router => {
  authentication(router);
  bucket(router);
  bucketItem(router);
  userProfile(router);
  return router;
};
////하나로 묶어준뒤 경로에 따라서 요청이 나감.
