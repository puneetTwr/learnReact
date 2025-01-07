import { Router } from "express";
import { authenticateToken } from "../middlewares/verifyToken";
import { getUserDetails } from "../controllers/userController";
const router = Router();

router.get("/userDetails", authenticateToken, getUserDetails);

export default router;
