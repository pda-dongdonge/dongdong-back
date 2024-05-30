import express, {Request, Response, NextFunction} from "express";
import { getBucketItem, addNewBucketItem } from "../models/BucketItem";
import { UserModel } from "../models/User";
import { BucketItemModel } from "../models/BucketItem";
import { BucketModel } from "../models/Bucket";
import axios from "axios";
import cheerio  from "cheerio";
import mongoose from "mongoose";

export const healthCheck = (req: Request, res: Response) => {
    return res.send("bucketItem healthy");
}

export const addURLBucketItem_c = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const { url, urlTitle, urlContent, imgUrl } = req.body;
  const { bucketId } = req.params;
  console.log(bucketId);
  const validUrl = require('valid-url');
  // Check if the bucket exists
    const bucket = await BucketModel.findById(bucketId);
    if (!bucket) {
      return res.status(404).json({ message: "버킷을 찾을 수 없습니다." });
    }
  try {


    //url형식 이상할 때
    if (!validUrl.isWebUri(url))  {
     /* const newBucketItem = {
        url: url,
        urlTitle: "제목",
        urlContent: urlContent,
        imgUrl:  "https://ifh.cc/g/8f9xoV.jpg",
      };
      
      console.log(newBucketItem);
      const result = await addNewBucketItem(newBucketItem);
      bucket.bucketItemList.push(result._id);
      await bucket.save();
  */
     // return res.json(result);
      return res.status(500).json({ message: "잘못된 URL 형식입니다." });
    }

    //url 문제 없을 때
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract the title and image URL
    const extractedTitle = $('meta[name="title"]').attr('content') || $('title').text();
    const extractedImgUrl = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src');

    // Create new bucket item
    const newBucketItem = {
      url: url,
      urlTitle: extractedTitle || "제목",
      urlContent: urlContent,
      imgUrl: extractedImgUrl || "https://ifh.cc/g/8f9xoV.jpg",
    };
    
    console.log(newBucketItem);
    const result = await addNewBucketItem(newBucketItem);
    bucket.bucketItemList.push(result._id);
    await bucket.save();

    return res.json(result);
  } catch (error) {
    const newBucketItem = {
      url: url,
      urlTitle: "제목",
      urlContent: urlContent,
      imgUrl:  "https://ifh.cc/g/8f9xoV.jpg",
    };
    
    console.log(newBucketItem);
    const result = await addNewBucketItem(newBucketItem);
    bucket.bucketItemList.push(result._id);
    await bucket.save();

    return res.json(result);
    /*if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      console.error("Axios error occurred:", error.message);
      if (error.response) {
        // Server responded with a status code out of the range of 2xx
        console.error("Error response data:", error.response.data);
        return res.status(error.response.status).json({ message: error.response.data });
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received:", error.request);
        return res.status(504).json({ message: "서버로부터 응답이 없습니다." });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", error.message);
        return res.status(500).json({ message: "요청 설정 중 오류가 발생했습니다." });
      }
    } else {
      // Non-Axios error
      console.error("Non-Axios error occurred:", error);
      return res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }*/
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

export const addBucketItemToBucket=async (req: Request, res: Response, next: NextFunction) => {
  const bucketId=req.params.bucketId;
  const bucketItemId=req.params.bucketItemId;
  if(!bucketId || !bucketItemId) {
    res.sendStatus(400).json({
        message: "잘못된 입력값..(이런식으로)"
    })
  }
  try {
    const bucket = await BucketModel.findById(bucketId);
    if (!bucket) {
      return res.status(404).json({ message: "버킷을 찾을 수 없습니다." });
    }

    const bucketItem = await BucketItemModel.findById(bucketItemId);
    if (!bucketItem) {
      return res.status(404).json({ message: "버킷 아이템을 찾을 수 없습니다." });
    }

    const objectIdBucketItemId = new mongoose.Types.ObjectId(bucketItemId);

    // 버킷 아이템이 이미 목록에 있는지 확인
    if (bucket.bucketItemList.includes(objectIdBucketItemId)) {
      return res.status(400).json({ message: "버킷 아이템이 이미 버킷에 있습니다." });
    }
  
          bucket.bucketItemList.push(bucketItem._id);
          await bucket.save();
          return res.status(200).send("success");

  } catch (error) {
      console.error("Error creating bucket:", error);
      return res.status(500).json({ message: "서버 에러" });
  }
}