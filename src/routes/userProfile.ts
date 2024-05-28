import express, { NextFunction, Request, Response } from "express";

export default (router: express.Router) => {
  router.get("/userprofile/:userId");
  router.post("/userprofile/follow/:userId");
};
