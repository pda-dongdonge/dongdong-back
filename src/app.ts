import "dotenv/config"; // env파일 사용
import cors from "cors";
import express from "express";
import createHttpError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

// MongoDB connection
mongoose.set("strictQuery", false); // Optionally set any mongoose global settings

mongoose
  .connect(MONGO_URI) // 쿼리스트링으로 DB설정 값들이 세팅되어있음.
  .then(() => {
    console.log("mongo Connected Success");
  })
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 1234;
//우선 우리프론트 포트만 허용했어용
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // CORS 이슈 해결
app.use(express.urlencoded({ extended: false })); // query 받기
app.use(express.json()); // body 받기
app.use(cookieParser()); //쿠키 파싱

app.use(
  //세션 미들웨어
  session({
    secret: process.env.SESSION_SECRET || "<my-secret>",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.get("/", function (req, res) {
  res.json({ message: "hello world" });
});

const router = express.Router();

router.get("/api", (req, res, next) => {
  res.json({ message: "welcome!" });
});

app.listen(PORT, () => {
  console.log(`
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃   Server listening on port: ${PORT}    ┃
  ┃     http://localhost:${PORT}/api       ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function (
  err: { message: any; status: any },
  req: { app: { get: (arg0: string) => string } },
  res: {
    locals: { message: any; error: any };
    status: (arg0: any) => void;
    json: (arg0: any) => void;
  },
  next: any
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  res.json(err);
});

export default app;
