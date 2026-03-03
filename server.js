// Express framework ko import kar rahe hain - ye web server banane ke liye use hota hai
import express from "express";
// Environment variables ko load karne ke liye dotenv import kar rahe hain
import dotenv from "dotenv";
// MongoDB database ke saath connection banane ke liye mongoose import kar rahe hain
import mongoose from "mongoose";

// Import all models to register them with mongoose


// Saare route files ko import kar rahe hain - ye different features ke liye alag-alag routes hain
import adminRoutes from "./routes/adminRoutes.js";           // Admin ke liye routes
import teacherRoutes from "./routes/teacherRoutes.js";       // Teacher ke liye routes
import studentRoutes from "./routes/studentRoutes.js";       // Student ke liye routes
import eventRoutes from "./routes/eventRoutes.js";           // Events ke liye routes
import noticeRoutes from "./routes/noticeRoutes.js";         // Notices ke liye routes
import homework from "./routes/homeworkRoutes.js";           // Homework ke liye routes
import examRoutes from "./routes/examRoutes.js";            // Exams ke liye routes
import resultRoute from "./routes/resultRoutes.js";         // Results ke liye routes
import leaveRoutes from "./routes/leaveRoutes.js";         // Leave requests ke liye routes
import adminAllRoutes from "./routes/adminAllRoutes.js";    // Admin ke saare routes
import attendStuRoutes from "./routes/attendStuRoutes.js"; // Student attendance routes
import attendTeaRoutes from "./routes/attendTeaRoutes.js";  // Teacher attendance routes
import feeRoutes from "./routes/feeRoutes.js";              // Fee management routes

// CORS (Cross-Origin Resource Sharing) ko enable karne ke liye - frontend se backend ko access karne ke liye
import cors from "cors";

// Environment variables ko load kar rahe hain (.env file se)
dotenv.config();

// Express app create kar rahe hain
const app = express();

// CORS setup - frontend se backend ko access karne ki permission de rahe hain
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3001",
    "https://school-management-frontend-mu-amber.vercel.app",
    /https:\/\/school-management-frontend-.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') return allowed === origin;
            if (allowed instanceof RegExp) return allowed.test(origin);
            return false;
        })) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// JSON data ko parse karne ke liye middleware - API requests mein JSON data aata hai
app.use(express.json());

// MongoDB database se connection banane ki koshish kar rahe hain
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,    // Naya URL parser use karne ke liye
    useUnifiedTopology: true  // Naya connection management use karne ke liye
})
    .then(() => console.log("✅ MongoDB connected"))                    // Success message
    .catch(err => console.error("❌ MongoDB connection error:", err));    // Error message

// JWT Secret key ko console mein print kar rahe hain (debugging ke liye)
console.log("JWT Secret:", process.env.JWT_SECRET);

// ========== API Routes Setup ==========

// Authentication Routes
app.use("/api/auth", adminRoutes);                    // Admin login/signup routes

// Teacher Routes
app.use("/api/teacher", teacherRoutes);               // Teacher self-service routes (my-students, my-subjects, etc.)
app.use("/api/admin/teachers", teacherRoutes);        // Admin teacher management routes

// Student Routes
app.use("/api/admin/students", studentRoutes);        // Student management routes

// Event Routes
app.use("/api/admin/events", eventRoutes);            // Event management routes

// Notice Routes
app.use("/api/admin/notices", noticeRoutes);         // Admin notice routes
app.use("/api/student/notices", noticeRoutes);        // Student notice routes
app.use("/api/teacher/notices", noticeRoutes);        // Teacher notice routes

// Exam Routes
app.use("/api/teacher/exam", examRoutes);            // Teacher exam routes
app.use("/api/student/exam", examRoutes);             // Student exam routes
app.use("/api/admin/exam", examRoutes);               // Admin exam routes

// Homework Routes
app.use("/api/teacher/homework", homework);           // Teacher homework routes
app.use("/api/student/homework", homework);           // Student homework routes
app.use("/api/admin/homework", homework);             // Admin homework routes

// Leave Routes
app.use("/api/student/leave", leaveRoutes);         // Student leave routes
app.use("/api/admin/leaves", leaveRoutes);           // Admin leave management routes
app.use("/api/teacher/leaves", leaveRoutes);         // Teacher leave management routes

// Admin Routes
app.use("/api/admin", adminAllRoutes);                // Admin ke saare general routes

// Attendance Routes
app.use("/api/attendance/student", attendStuRoutes);  // Student attendance routes
app.use("/api/attendance/teacher", attendTeaRoutes);  // Teacher attendance routes

// Results Routes
app.use("/api/student/results", resultRoute);         // Student results routes
app.use("/api/teacher/results", resultRoute);          // Teacher results routes
app.use("/api/admin/results", resultRoute);           // Admin results routes

// Fee Routes
app.use("/api/admin/fees", feeRoutes);                // Admin fee management routes
app.use("/api/student/fees", feeRoutes);              // Student fee routes

// Default route - jab koi home page par jaye to ye message dikhega
app.get("/", (req, res) => {
    res.send("School Management API running on port " + (process.env.PORT || 3000));
});

// Server start karne ka code
const PORT = process.env.PORT || 3000;  // Port number environment variable se ya default 3000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

