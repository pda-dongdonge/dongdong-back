import express, {Request, Response, NextFunction} from "express";
import { getBucketItem, addNewBucketItem } from "../models/BucketItem";
import { UserModel } from "../models/User";
import { BucketItemModel } from "../models/BucketItem";
import { BucketModel } from "../models/Bucket";
import axios from "axios";
import cheerio from 'cheerio';

export const healthCheck = (req: Request, res: Response) => {
    return res.send("bucketItem healthy");
}

export const addURLBucketItem_c = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { url, urlTitle, urlContent, imgUrl } = req.body;
  const { userId, bucketId } = req.params;

  if (!url || !urlTitle || !urlContent) {
    return res.status(400).json({
      message: "잘못된 입력값..(이런식으로)"
    });
  }

  try {
    // Fetch the URL content
    const dummyurl ="https://www.youtube.com/watch?v=uEtptC01tEM"
    const response = await axios.get(dummyurl);
    const html = response.data;
    const $ = cheerio.load(html);
    console.log("jo")

    // Extract the title and image URL
    const extractedTitle = $('meta[name="title"]').attr('content') || $('title').text();
    const extractedImgUrl = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src');

    // Check if the bucket exists
    const bucket = await BucketModel.findById(bucketId);
    if (!bucket) {
      return res.status(404).json({ message: "버킷을 찾을 수 없습니다." });
    }

    // Create new bucket item
    const newBucketItem = {
      url: url,
      urlTitle: extractedTitle || urlTitle,
      urlContent: urlContent,
      imgUrl: extractedImgUrl || imgUrl,
    };
    
    console.log(newBucketItem);
    const result = await addNewBucketItem(newBucketItem);
    bucket.bucketItemList.push(result._id);
    await bucket.save();

    return res.json(result);
  } catch (error) {
    console.error("Error creating bucket:", error);
    return res.status(500).json({ message: "서버 에러" });
  }
};
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