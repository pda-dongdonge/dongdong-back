import express from "express";
import { 
    healthCheck,
    addNewBucketItem_c,
 } from "../controllers/bucketItem";

export default (router: express.Router) => {
    router.get("/bucketItem", healthCheck);
    router.post('/bucketItem/:bucketId',addNewBucketItem_c);
};