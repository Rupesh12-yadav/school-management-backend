import express from "express";
import {
  createLeaveRequest,
  getAllLeaves,
  getTeacherLeaves,
  getMyLeaves,
  updateLeaveStatus
} from "../controllers/leaveController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ========== Student Routes ==========
router.post("/apply", protect, authorizeRoles("Student"), createLeaveRequest);
router.get("/my-leaves", protect, authorizeRoles("Student"), getMyLeaves);

// ========== Admin Routes ==========
router.get("/all", protect, authorizeRoles("Admin"), getAllLeaves);
router.put("/:id", protect, authorizeRoles("Admin","Teacher"), updateLeaveStatus);

// ========== Teacher Routes ==========
// Note: Teachers can also access admin routes for leave management
router.get("/teacher-leaves", protect, authorizeRoles("Teacher", "Admin"), async (req, res) => {
  console.log('Teacher leaves route accessed by:', req.user?.role, req.user?.id);
  try {
    await getTeacherLeaves(req, res);
  } catch (error) {
    console.error('Error in getTeacherLeaves:', error);
    res.status(500).json({ message: error.message });
  }
});
router.put("/:id", protect, authorizeRoles("Teacher", "Admin"), async (req, res) => {
  console.log('Update leave status route accessed by:', req.user?.role, req.user?.id, 'for leave ID:', req.params.id);
  console.log('Request body:', req.body);
  try {
    await updateLeaveStatus(req, res);
  } catch (error) {
    console.error('Error in updateLeaveStatus:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
