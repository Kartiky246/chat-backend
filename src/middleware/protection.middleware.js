import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const protection = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log("token authorization failed", error);
    throw new Error("Not authorized, token failed");
  }
};

export default protection;
