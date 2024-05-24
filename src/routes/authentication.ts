import express, { NextFunction, Request, Response } from "express";
import { register } from "../controllers/authentication";
import { createToken, verifyToken } from "../utils/auth";

export default (router: express.Router) => {
  router.post("/auth/register", register);
};
