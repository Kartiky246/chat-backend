import { Router } from "express";
const router = Router();

// importing the middlewares
import { upload } from "../middleware/multer.middleware.js";

// importing the controllers
import {
  findUserWithName,
  login,
  register,
} from "../controllers/user.controller.js";
import protection from "../middleware/protection.middleware.js";

router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);
router.route("/searchUser").get(protection, findUserWithName);

export default router;
