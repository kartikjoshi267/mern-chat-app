import { Router } from "express";
import { registerUser, authUser, allUsers } from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser);

export default router;