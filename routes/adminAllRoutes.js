import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

// Import controllers
import { getAllEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import { getAllHomework, createHomework, updateHomework, deleteHomework } from "../controllers/homeworkController.js";
import { getAllLeaves, updateLeaveStatus } from "../controllers/leaveController.js";
import { getStudentAttendance, getTeacherAttendance, markStudentAttendance, markTeacherAttendance } from "../controllers/attendanceController.js";
import { getAllStudents, createStudent, updateStudent, deleteStudent, getUniqueSections } from "../controllers/studentController.js";
import { getAllNotices, createNotice, updateNotice, deleteNotice } from "../controllers/noticeController.js";
import { getAllResults } from "../controllers/ResultController.js";
import { getAllClasses, createClass, updateClass, deleteClass, getClass, createPredefinedClasses, deleteAllClasses } from "../controllers/classController.js";
import { getAllHolidays, createHoliday, deleteHoliday } from "../controllers/holidayController.js";
// Admin controller functions import kar rahe hain
import { 
  getAllAdmins, 
  getAdminById, 
  createAdmin, 
  updateAdmin, 
  deleteAdmin, 
  getAdminDashboardData 
} from "../controllers/adminController.js";
import { getAllHomework as getAdminHomework } from "../controllers/homeworkController.js";
import { getAllExamResults as getAdminResults } from "../controllers/ResultController.js";

const router = express.Router();

// Admin only access - Saare routes sirf Admin access kar sakta hai
router.use(protect);
router.use(authorizeRoles("Admin"));

// ========== ADMIN MANAGEMENT ==========
router.get("/admins", getAllAdmins);              // Saare admins ki list
router.get("/admins/:id", getAdminById);          // Specific admin ki details
router.post("/admins", createAdmin);              // Naya admin create karna
router.put("/admins/:id", updateAdmin);           // Admin update karna
router.delete("/admins/:id", deleteAdmin);        // Admin delete karna
router.get("/dashboard", getAdminDashboardData);   // Dashboard data

// ========== EVENTS MANAGEMENT ==========
router.get("/events", getAllEvents);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// ========== HOMEWORK MANAGEMENT ==========
router.get("/homework", getAllHomework);
router.post("/homework", createHomework);
router.put("/homework/:id", updateHomework);
router.delete("/homework/:id", deleteHomework);

// ========== LEAVE MANAGEMENT ==========
router.get("/leaves", getAllLeaves);
router.put("/leaves/:id", updateLeaveStatus);

// ========== ATTENDANCE MANAGEMENT ==========
router.get("/attendance/students", getStudentAttendance);
router.get("/attendance/teachers", getTeacherAttendance);
router.post("/attendance/students", markStudentAttendance);
router.post("/attendance/teachers", markTeacherAttendance);

// ========== STUDENTS MANAGEMENT ==========
router.get("/students/sections", getUniqueSections);  // Unique sections list (pehle specific route)
router.get("/students", getAllStudents);
router.post("/students", createStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// ========== NOTICES MANAGEMENT ==========
router.get("/notices", getAllNotices);
router.post("/notices", createNotice);
router.put("/notices/:id", updateNotice);
router.delete("/notices/:id", deleteNotice);

// ========== RESULTS MANAGEMENT ==========
router.get("/results", getAllResults);

// ========== CLASSES MANAGEMENT ==========
router.get("/classes", getAllClasses);                    // Saari classes ki list
router.post("/classes", createClass);                     // Nayi class create karna
router.get("/classes/:id", getClass);                    // Specific class ki details
router.put("/classes/:id", updateClass);                 // Class update karna
router.delete("/classes/:id", deleteClass);              // Class delete karna

// Predefined Classes Management
router.post("/classes/predefined", createPredefinedClasses); // Predefined classes create karna
router.delete("/classes/all", deleteAllClasses);             // Saari classes delete karna

// ========== HOLIDAYS MANAGEMENT ==========
router.get("/holidays", getAllHolidays);
router.post("/holidays", createHoliday);
router.delete("/holidays/:id", deleteHoliday);

export default router;