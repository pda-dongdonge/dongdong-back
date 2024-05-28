import { UserModel } from "../models/User";

export const getUserBucket = async (req: Request, res: Response) => {
    try {
        const result = await UserModel.find();
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}
