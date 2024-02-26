import protection from "../middleware/protection.middleware.js";
import { Router } from "express";
const router = Router();

// importing controllers
import { allMessage, sendMessage } from "../controllers/message.controller.js";

router.route("/").post(protection, sendMessage);
router.route("/:chatId").get(protection, allMessage);

export default router;
