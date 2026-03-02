import express from "express";
import {
    createNotice,
    getAllNotices,
    getNoticeById,
    updateNotice,
    deleteNotice
} from "../controllers/noticeController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public route - Anyone can view notices
router.get("/all", protect, getAllNotices);
router.get("/:id", protect, getNoticeById);

// Admin-only routes
router.post("/add", protect, authorizeRoles("Admin"), createNotice);
router.put("/:id", protect, authorizeRoles("Admin"), updateNotice);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteNotice);

export default router;
