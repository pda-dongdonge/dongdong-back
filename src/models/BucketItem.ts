import mongoose, { Schema } from "mongoose";
const bucketItemSchema = new Schema({
    url: {
        type: String,
        required: [true, "저장하고 싶은 영상을 선택해주세요."],
    },
    urlTitle: {
        type: String,
        required: [true, "영상의 제목을 입력해주세요"],
        maxlength:[50, "50자 이내로 입력해 주세요"]
    },
    urlContent: {
        type: String,
        required: [true, "영상의 정보를 입력해 주세요."],
        maxlength:[100, "100자 이내로 입력해 주세요."]
    },
    imgUrl: {
        type: String,
        default:""
    },
    
});

export interface BucketItem {
    url: string,
    urlTitle: String,
    urlContent: String, 
    imgUrl?: String
}

export const BucketItemModel = mongoose.model("bucketItem", bucketItemSchema);

export const getBucketItem= () => BucketItemModel.find();

// export const addNewBucketItem = (bucketItem: BucketItem) => {
//     BucketItemModel.create({
//         url: bucketItem.url,
//         urlTitle: bucketItem.urlTitle,
//         urlContent: bucketItem.urlContent,
//         imgUrl: bucketItem.impUrl
//     });
// }

export const addNewBucketItem = async (bucketItem: BucketItem) => {
    const newBucketItem = new BucketItemModel({
        url: bucketItem.url,
        urlTitle: bucketItem.urlTitle,
        urlContent: bucketItem.urlContent,
        imgUrl: bucketItem.imgUrl            // Optional, initialize if not provided
    });
    try {
        const savedBucketItem = await newBucketItem.save();
        return savedBucketItem;
    } catch (error) {
        console.error("Error creating bucket:", error);
        throw error;
    }
}

