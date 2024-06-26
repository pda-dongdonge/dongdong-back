import { ObjectId } from "mongodb";
import mongoose, { Document, Schema, Model } from "mongoose";

const userSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    required: true,
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    required: true,
  },
  likedBucket: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "bucket",
  },
  username: {
    type: String,
    required: true,
  },
});

export const UserProfileModel = mongoose.model("UserProfile", userSchema);

export const getUserProfiles = () => UserProfileModel.find();
export const getUserProfileById = (userId: string) =>
  UserProfileModel.findOne({ userId });
export const createUserProfile = (values: Record<string, any>) =>
  new UserProfileModel(values)
    .save()
    .then((user) => user.toObject())
    .catch((err) => {
      return err;
    });
export const deleteUserById = (userId: string) =>
  UserProfileModel.findOneAndDelete({ userId: userId });
export const updateUserProfileById = (
  _id: ObjectId,
  values: Record<string, any>
) => {
  return UserProfileModel.findByIdAndUpdate(_id, values, {
    new: true,
    useFindAndModify: false,
  });
};
