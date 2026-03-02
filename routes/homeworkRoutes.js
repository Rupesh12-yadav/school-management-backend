import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createHomework,
  getAllHomework,
  getHomeworkById,
  updateHomework,
  deleteHomework,
  getTeacherSubjects,
  getAvailableClasses
} from "../controllers/homeworkController.js";

const router = express.Router();

router.use(protect); // Saare routes protected hain

router.post("/add", createHomework);
router.get("/all", getAllHomework);
router.get("/teacher-subjects", getTeacherSubjects);
router.get("/available-classes", getAvailableClasses);
router.get("/:id", getHomeworkById);
router.put("/:id", updateHomework);
router.delete("/:id", deleteHomework);

export default router;