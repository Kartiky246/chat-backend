import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import NodeCache from "node-cache";
const cache = new NodeCache();
const validateUsers = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const validateUser = cache.get(_id);
    if (!validateUser) {
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json(new ApiResponse(400, "User not found"));
      }
      cache.set(_id, user, 1000);
      next();
    } else {
      next();
    }
  } catch (error) {
    console.log(error, "Can not validate users");
    return res
      .status(400)
      .status(new ApiError(400, "Failed in validating the user"));
  }
};

export default validateUsers;
