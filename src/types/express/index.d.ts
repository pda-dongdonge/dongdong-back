import jwt from "jsonwebtoken";
declare global {
  namespace Express {
    interface Request {
      userToken?: string | jwt.JwtPayload | null;
    }
  }
}
