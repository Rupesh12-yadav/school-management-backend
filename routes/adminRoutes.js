// Express router import kar rahe hain
import express from "express";
// Admin controller functions import kar rahe hain
import { 
  registerAdmin, 
  loginAdmin, 
  adminOnly, 
  studentOnly, 
  teacherOnly,
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminDashboardData,
  getAdminClasses
} from "../controllers/adminController.js";
// Authentication middleware import kar rahe hain
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🌍 PUBLIC ROUTES - Koi bhi access kar sakta hai
router.post("/register", registerAdmin);  // Admin registration
router.post("/login", loginAdmin);        // Login for all users

// 🔒 PROTECTED ROUTES - Sirf logged in users
router.get("/admin-only", protect, authorizeRoles("Admin"), adminOnly);
router.get("/student-only", protect, authorizeRoles("Student"), studentOnly);
router.get("/teacher-only", protect, authorizeRoles("Teacher"), teacherOnly);

// 📋 ADMIN MANAGEMENT ROUTES - Sirf Admin access kar sakta hai
router.use(protect);                      // Saare niche wale routes protected hain
router.use(authorizeRoles("Admin"));      // Sirf Admin role wale access kar sakte hain

// Admin CRUD operations
router.get("/admins", getAllAdmins);           // Saare admins ki list
router.get("/admins/:id", getAdminById);       // Specific admin ki details
router.post("/admins", createAdmin);           // Naya admin create karna
router.put("/admins/:id", updateAdmin);        // Admin update karna
router.delete("/admins/:id", deleteAdmin);     // Admin delete karna

// Dashboard data
router.get("/dashboard", getAdminDashboardData); // Dashboard ke liye data
router.get("/classes", getAdminClasses);         // Admin ke assigned classes

export default router;
