import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/messageContollers.js";
const router = Router();

router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);

export default router;