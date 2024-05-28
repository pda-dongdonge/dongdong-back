import express, { Request, Response } from "express";
import { UserModel } from "../models/User";
//import UserModel from "../models/UserModel"; // UserModel을 import 해야 합니다.

export default (router: express.Router) => {
    router.get("/userbucket", async (req: Request, res: Response) => {
        try {
            const result = await UserModel.find();
            res.json(result);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    });
};
