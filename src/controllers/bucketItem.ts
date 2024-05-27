import express, {Request, Response, NextFunction} from "express";
import { getBucketItem, addNewBucketItem } from "../models/BucketItem";
import { UserModel } from "../models/User";
import { BucketItemModel } from "../models/BucketItem";
import { BucketModel } from "../models/Bucket";

export const healthCheck = (req: Request, res: Response) => {
    return res.send("bucketItem healthy");
}

export const addURLBucketItem_c= async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const {url, urlTitle, urlContent, imgUrl } = req.body;
    const {userId}=req.params;
    const {bucketId}=req.params;
    if(!url || !urlTitle || !urlContent) {
        res.sendStatus(400).json({
            message: "잘못된 입력값..(이런식으로)"
        })
    }
    try {
        //크롤링 로직 추가
        const bucket = await BucketModel.findById(bucketId);
        if (!bucket) {
          return res.status(404).json({ message: "버킷을 찾을 수 없습니다." });
        }
    
        // Create a new bucket item
        const bucketItem = new BucketItemModel({
          url,
          urlTitle,
          urlContent,
          imgUrl
        });
    
        // Save the new bucket item
        await bucketItem.save();
    
        // Add the bucket item to the bucket's item list
        bucket.bucketItemList.push(bucketItem._id);
    
        // Save the updated bucket
        await bucket.save();
    
        // Send the created bucket item as the response
        return res.json(bucketItem);
      } catch (error) {
        console.error("Error creating bucket item:", error);
        return res.status(500).json({ message: "서버 에러" });
      }
}
export const addNewBucketItem_c = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const {url, urlTitle, urlContent, imgUrl } = req.body;
  const {bucketId}=req.params;
  if(!url || !urlTitle || !urlContent) {
    res.sendStatus(400).json({
        message: "잘못된 입력값..(이런식으로)"
    })
  }
  try {
      const bucket = await BucketModel.findById( bucketId );
          if (!bucket) {
              return res.status(404).json({ message: "버킷를 찾을 수 없습니다." });
          }
  
          const newBucketItem ={
            url:url,
            urlTitle:urlTitle,
            urlContent:urlContent,
            imgUrl:imgUrl
          };
      
  
          const result = await addNewBucketItem(newBucketItem);
          bucket.bucketItemList.push(result._id);
          await bucket.save();
          
          return res.json(result);


  } catch (error) {
      console.error("Error creating bucket:", error);
      return res.status(500).json({ message: "서버 에러" });
  }
}