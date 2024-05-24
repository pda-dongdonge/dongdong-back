import "dotenv/config"; // env파일 사용
import http from "http";
import cors from "cors";
import express from "express";
import createHttpError, { HttpError } from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import router from "./routes";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

mongoose.set("strictQuery", false); // Optionally set any mongoose global settings

// MongoDB connection
mongoose
  .connect(MONGO_URI) // 쿼리스트링으로 DB설정 값들이 세팅되어있음.
  .then(() => {
    console.log("mongo Connected Success");
  })
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 1234;
//우선 우리 프론트 포트만 허용했어용
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // CORS 이슈 해결
app.use(express.urlencoded({ extended: false })); // url 인코딩. query 받기
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

const server = http.createServer(app);

app.listen(PORT, () => {
  console.log(`
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  ┃   Server listening on port: ${PORT}    ┃
  ┃     http://localhost:${PORT}/       ┃
  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  `);
});
app.use("/", router());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createHttpError(404));
});

// error handler
app.use(function (err: HttpError, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  res.json(err);
});

export default app;
