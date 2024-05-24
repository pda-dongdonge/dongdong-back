import express from "express";
import authentication from "./authentication";
import bucket from "./bucket";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  bucket(router);
  return router;
};
