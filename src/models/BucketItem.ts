import mongoose, { Schema } from "mongoose";
const bucketItemSchema = new Schema({
    url: {
        type: String,
        required: [true, "저장하고 싶은 영상을 선택해주세요."],
    },
    urlTitle: {
        type: String,
        // required: [true, "영상의 제목을 입력해주세요"],
        maxlength:[10000],
        default:"제목"
    },
    urlContent: {
        type: String,
        required: [true, "영상의 정보를 입력해 주세요."],
        maxlength:[10000]
    },
    imgUrl: {
        type: String,
        default:"http://localhost:5173/tungtung.png"
    },
    
});

export interface BucketItem {
    url: string,
    urlTitle: String,
    urlContent: String, 
    imgUrl?: string
}

export const BucketItemModel = mongoose.model("BucketItem", bucketItemSchema);

export const getBucketItem= () => BucketItemModel.find();

export const addNewBucketItem = async (bucketItem: BucketItem) => {
    const newBucketItem = new BucketItemModel({
      url: bucketItem.url,
      urlTitle: bucketItem.urlTitle,
      urlContent: bucketItem.urlContent,
      imgUrl: bucketItem.imgUrl // Optional, initialize if not provided
    });
  
    try {
      const savedBucketItem = await newBucketItem.save();
      return savedBucketItem;
    } catch (error) {
      console.error("Error creating bucket:", error);
      throw error;
    }
  };
