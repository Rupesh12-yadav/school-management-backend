import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherStudents,
  getTeacherSubjects,
  getTeacherClasses,
  getTeacherSections,
  getTeacherExams
} from "../controllers/teacherController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ========== Teacher Self-Service Routes ==========
// These routes are for teachers to access their own data
router.get("/my-students", protect, authorizeRoles("Teacher"), getTeacherStudents);
router.get("/my-subjects", protect, authorizeRoles("Teacher"), getTeacherSubjects);
router.get("/my-classes", protect, authorizeRoles("Teacher"), getTeacherClasses);
router.get("/my-sections", protect, authorizeRoles("Teacher"), getTeacherSections);
router.get("/my-exams", protect, authorizeRoles("Teacher"), getTeacherExams);

// ========== Admin Teacher Management Routes ==========
// These routes are for admins to manage teachers
router.post("/add", protect, authorizeRoles("Admin"), createTeacher);
router.get("/all", protect, authorizeRoles("Admin"), getAllTeachers);
router.get("/:id", protect, authorizeRoles("Admin"), getTeacherById);
router.put("/update/:id", protect, authorizeRoles("Admin"), updateTeacher);
router.delete("/delete/:id", protect, authorizeRoles("Admin"), deleteTeacher);

export default router;
