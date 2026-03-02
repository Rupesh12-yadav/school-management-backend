import express from "express";
import { 
  addTeacherAttendance, 
  getTeacherAttendance, 
  getAllTeachersAttendance,
  updateTeacherAttendance,
  deleteTeacherAttendance 
} from "../controllers/AttendTeacherContller.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/", authorizeRoles("Admin", "Teacher"), addTeacherAttendance);
router.get("/", authorizeRoles("Admin", "Teacher"), getAllTeachersAttendance);
router.get("/:teacherId", authorizeRoles("Admin", "Teacher"), getTeacherAttendance);
router.put("/:id", authorizeRoles("Admin", "Teacher"), updateTeacherAttendance);
router.delete("/:id", authorizeRoles("Admin"), deleteTeacherAttendance);

export default router;
