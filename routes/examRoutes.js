import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam
} from "../controllers/examController.js";

const router = express.Router();

router.use(protect);

// ========== Teacher Routes (Create, Update, Delete) ==========
router.post("/add", authorizeRoles("Teacher"), createExam);
router.put("/:id", authorizeRoles("Teacher"), updateExam);
router.delete("/:id", authorizeRoles("Teacher"), deleteExam);

// ========== Shared Routes (View) ==========
// Both Teacher and Student can view exams
router.get("/all", getAllExams);
router.get("/:id", getExamById);

export default router;
