import { Router } from "express";
const router = Router();

// importing the middlewares
import { upload } from "../middleware/multer.middleware.js";

// importing the controllers
import {
  accessChat,
  fetchChats,
  createGroupChat,
  changename,
  addToGroup,
  removeFromGroup,
} from "../controllers/chat.controller.js";

// middleware
import protection from "../middleware/protection.middleware.js";
import validateUsers from "../middleware/validateUsers.middleware.js";

router.route("/").post([protection, validateUsers, accessChat]);
router.route("/").get(protection, fetchChats);
router.route("/creategroup").post(protection, createGroupChat);
router.route("/changename").put(protection, changename);
router.route("/groupremove").put(protection, removeFromGroup);
router.route("/groupadd").put(protection, addToGroup);

export default router;
