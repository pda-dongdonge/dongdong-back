import mongoose, { Document, Schema, Model } from "mongoose";

const userSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "user",
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "user",
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
  userId: string,
  values: Record<string, any>
) => UserProfileModel.findByIdAndUpdate(userId, values);
