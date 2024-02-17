import expres from "express";
const app = expres();
import cors from "cors";
import cookieParser from "cookie-parser";
// import router
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(expres.json({ limit: "20kb" }));
app.use(expres.urlencoded({ extended: true }));
app.use(cookieParser());

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
export { app };
