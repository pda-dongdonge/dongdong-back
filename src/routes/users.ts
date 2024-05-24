import express, { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import { createToken, verifyToken } from "../../utils/auth";

let router = express.Router();

/* GET users listing. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.status(200).send("respond with a resource");
});

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.signUp(email, password);
      res.status(201).json(user);
    } catch (err) {
      res.status(400);
      next(err);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.login(email, password);
      const tokenMaxAge = 60 * 60 * 24 * 3;
      const token = createToken(user, tokenMaxAge);
      user.token = token;
      res.cookie("authToken", token, {
        httpOnly: true,
        maxAge: tokenMaxAge * 1000,
        secure: false,
        sameSite: false, //cross domain 쿠키 적용 허용
      });
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(400);
      next(err);
    }
  }
);
router.all(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(res.cookie);
      res.cookie("authToken", "", {
        httpOnly: true,
        secure: false,
        sameSite: false,
      });
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(400);
      next(err);
    }
  }
);

module.exports = router;
