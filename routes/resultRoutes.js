import express from "express";
import {
    postExamResult,
    getAllExamResults,
    getExamResultById,
    updateExamResult,
    deleteExamResult,
    getAllResults
} from "../controllers/ResultController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔒 Protect all routes
router.use(protect);

// ========== Teacher Routes (Create, Update, Delete) ==========
router.post("/add", authorizeRoles("Teacher"), postExamResult);
router.put("/:id", authorizeRoles("Teacher"), updateExamResult);
router.delete("/:id", authorizeRoles("Teacher"), deleteExamResult);

// ========== Teacher Routes (View own results) ==========
router.get("/my-results", authorizeRoles("Teacher"), getAllExamResults);

// ========== Shared Routes (View) ==========
// Both Teacher and Student can view results
router.get("/all", getAllResults);
router.get("/result/:id", getExamResultById);

export default router;
