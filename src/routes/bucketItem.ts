import express from "express";

import { 
    healthCheck,
    addNewBucketItem_c,
    addURLBucketItem_c,
    addBucketItemToBucket
 } from "../controllers/bucketItem";

export default (router: express.Router) => {
    router.get("/bucketItem", healthCheck);
    router.post('/bucketItem/:bucketId',addNewBucketItem_c);
    router.post('/bucket/url/:bucketId',addURLBucketItem_c );
    router.get('/bucket/:bucketId/:bucketItemId',addBucketItemToBucket )
};