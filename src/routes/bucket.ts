import express from "express";
import { 
    healthCheck,
    addNewBucket_c,
 } from "../controllers/bucket";

export default (router: express.Router) => {
    router.get("/bucket", healthCheck);
    router.post("/bucket", addNewBucket_c);
};