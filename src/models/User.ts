import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { isEmail } from "validator";
import { authenticate } from "../utils/auth";

// 사용자 인터페이스 정의
export interface IVisibleUser {
  _id: string;
  email: string;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // validate: [isEmail, " ."],
    //TODO: validate 문서읽어보고 작성
    validate: [
      (value: string) => {
        if (!value) {
          return false;
        }
        return true;
      },
      "Email이 입력되어야합니다.",
    ],
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
  },
  authentication: {
    password: { type: String, required: true, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("user", userSchema);
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values)
    .save()
    .then((user) => user.toObject())
    .catch((err) => {
      return err;
    });
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
