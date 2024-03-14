import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const protection = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    console.log("REQOBJ",req)

    console.log("COOKIES",token)
    console.log("env variable",process.env.ACCESS_TOKEN_SECRET)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log("DEC",decoded)
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log("token authorization failed", error);
    throw new Error("Not authorized, token failed");
  }
};

export default protection;
