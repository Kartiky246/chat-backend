import { Router } from "express";
const router = Router();

// importing the middlewares
import { upload } from "../middleware/multer.middleware.js";

// importing the controllers
import { register } from "../controllers/user.controller.js";

router.route("/register").post(upload.single("avatar"), register);

export default router;
