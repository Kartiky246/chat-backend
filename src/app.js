import expres from "express";
const app = expres();
import cors from "cors";
// import router
import userRouter from "./routes/user.routes.js";

// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(expres.json({ limit: "20kb" }));
app.use(expres.urlencoded({ extended: true }));

// routes declaration
app.use("/api/v1/users", userRouter);

export { app };
