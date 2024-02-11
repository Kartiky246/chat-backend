import { Router } from "express";
const router = Router();

// importing the middlewares
import { upload } from "../middleware/multer.middleware.js";

// importing the controllers
import { login, register } from "../controllers/user.controller.js";

router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);

export default router;
