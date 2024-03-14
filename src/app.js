import expres from "express";
const app = expres();
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./misc/error.middleware.js";
// import router
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*'); 
})

app.use(expres.json({ limit: "20kb" }));
app.use(expres.urlencoded({ extended: true }));
app.use(cookieParser());

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

app.use(notFound);
app.use(errorHandler);
export { app };
