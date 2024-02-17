import { Router } from "express";
const router = Router();

// importing the middlewares
import { upload } from "../middleware/multer.middleware.js";

// importing the controllers
import { sendMessage } from "../controllers/chat.controller.js";

// middleware
import protection from "../middleware/protection.middleware.js";
import validateUsers from "../middleware/validateUsers.middleware.js";

router.route("/chatting").post([protection, validateUsers, sendMessage]);

export default router;
