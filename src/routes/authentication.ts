import express, { NextFunction, Request, Response } from "express";
import {
  register,
  login,
  isLogin,
  logout,
  emailVerifyCheck,
} from "../controllers/authentication";
import { createToken, verifyToken } from "../utils/auth";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/islogin", isLogin);
  router.get("/auth/logout", logout);
  router.post("/auth/emailverify", emailVerifyCheck);
};
