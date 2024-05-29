import { BucketModel, Bucket } from "../models/Bucket";
import { UserProfileModel } from "../models/UserProfile";
import { UserModel } from "../models/User";
import mongoose from "mongoose";

//나중에 인터페이스 만들어서 리팩토링..
// interface BucektDetail {

// }

export const getBucketDetail_d = async (bucketId: string) => {
  try {
    console.log(mongoose.models);
    const bucketDetail = await BucketModel.findById(bucketId)
      .select("-__v")
      .populate({
        path: "bucketItemList",
        select: "-__v", // 각 bucketItem의 __v 필드를 제외
      })
      .populate({
        path: "maker",
        select: "_id username",
      })
      .lean<Bucket>();

    if (bucketDetail) {
      return {
        ...bucketDetail,
        likeUser: bucketDetail.likeUser.length, // likeUser를 배열의 길이로 변경
      };
    }

    return bucketDetail;
  } catch (error) {
    throw error;
  }
};

export const bucketLike_d = async (
  bucketId: string,
  userId: mongoose.Types.ObjectId
) => {
  // 두 개의 모델을 건드리므로 트랜잭션 처리 필요
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    //bucket에 찾고 추가
    await BucketModel.updateOne(
      { _id: bucketId },
      {
        $addToSet: {
          likeUser: userId, //userId를 버킷을 like한 사용자에 리스트에 추가
        },
      },
      { session }
    );

    //UserProfile -> userId 필드는 ref user
    await UserProfileModel.updateOne(
      { userId: userId },
      {
        $addToSet: {
          likedBucket: bucketId, //bucketId를 좋아요 한 배열 목록에 추가
        },
      },
      { session }
    );
    await session.commitTransaction(); //성공 시 커밋

    return true;
  } catch (error) {
    console.log("bucketLike failed.\n", error);
    await session.abortTransaction(); //실패 시 롤백
    throw Error("좋아요 추가 실패하였습니다.");
  } finally {
    session.endSession();
  }
};

//좋아요 했으면 true, 안 했으면 false 반환하는 함수
export const checkLiked = async (
  bucketId: string,
  userId: mongoose.Types.ObjectId
): Promise<boolean> => {

  const bucket = await BucketModel.find(
    { _id: bucketId },
    { _id: 1, likeUser: 1 }
  ).then((result) => {
    return result[0];
  });

  const user = await UserProfileModel.find(
    { userId: userId },
    { likedBucket: 1 }
  ).then((result) => {
    return result[0];
  });

  //   console.log('\nlikeUserList : ', bucket.likeUser); //특정 버킷을 좋아요 한 유저 리스트 목록
  //   console.log('\nbucket : ', user.likedBucket);//버킷 좋아요 한 유저

  //   console.log(bucket.likeUser.includes(userId) //서로의 배열에 들어있는 지 확인
  //   && user.likedBucket.includes(bucket._id)
  //   );

  return (
    bucket.likeUser.includes(userId) && user.likedBucket.includes(bucket._id)
  );
};

export const deleteLiked = async (
  bucketId: string,
  userId: mongoose.Types.ObjectId
) => {
      // 두 개의 모델을 건드리므로 트랜잭션 처리 필요
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    //bucket에 찾고 추가
    await BucketModel.updateOne(
      { _id: bucketId },
      {
        $pull: {
          likeUser: userId, //userId를 버킷을 like한 사용자에 리스트에서 삭제
        },
      },
      { session }
    );

    //UserProfile -> userId 필드는 ref user
    await UserProfileModel.updateOne(
      { userId: userId },
      {
        $pull: {
          likedBucket: bucketId, //bucketId를 좋아요 한 배열 목록에 삭제
        },
      },
      { session }
    );
    await session.commitTransaction(); //성공 시 커밋

    return true;
  } catch (error) {
    console.log("delete like failed.\n", error);
    await session.abortTransaction(); //실패 시 롤백
    throw Error("좋아요 삭제 실패하였습니다.");
  } finally {
    session.endSession();
  }

};
