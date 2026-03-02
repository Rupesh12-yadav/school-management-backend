import express from "express";
import { 
  addStudentAttendance, 
  getStudentAttendance, 
  getAllStudentsAttendance,
  updateStudentAttendance,
  deleteStudentAttendance 
} from "../controllers/AttenStudentContller.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

// Mark attendance - Admin aur Teacher
router.post("/", authorizeRoles("Admin", "Teacher"), addStudentAttendance);

// Get all students attendance - Admin aur Teacher
router.get("/", authorizeRoles("Admin", "Teacher"), getAllStudentsAttendance);

// Get specific student attendance - Admin, Teacher aur Student
router.get("/:studentId", authorizeRoles("Admin", "Teacher", "Student"), getStudentAttendance);

// Update attendance - Admin aur Teacher
router.put("/:id", authorizeRoles("Admin", "Teacher"), updateStudentAttendance);

// Delete attendance - Admin only
router.delete("/:id", authorizeRoles("Admin"), deleteStudentAttendance);

export default router;
