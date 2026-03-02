// Authentication Middleware - ye file user authentication aur authorization handle karti hai

// JWT (JSON Web Token) library import kar rahe hain - token verification ke liye
import jwt from "jsonwebtoken";
// Saare user models import kar rahe hain
import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

// 🔒 PROTECT MIDDLEWARE - ye check karta hai ki user logged in hai ya nahi
// Har protected route se pehle ye function chalega
export const protect = async (req, res, next) => {
  let token;

  try {
    // 🔍 STEP 1: Authorization header check kar rahe hain
    // Header format: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      // "Bearer " ke baad ka part (actual token) extract kar rahe hain
      token = req.headers.authorization.split(" ")[1];
      console.log('🔐 Token received:', token.substring(0, 20) + '...');

      // Agar token nahi mila to error
      if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
      }

      // 🔐 STEP 2: Token verify kar rahe hain
      // JWT secret key se token ko decode kar rahe hain
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123");
      console.log('🔐 Decoded token:', decoded);

      // 👤 STEP 3: User role ke basis par database se user find kar rahe hain
      let user;
      const role = decoded.role || decoded.userRole; // Token se role extract kar rahe hain
      console.log('🔐 Role from token:', role);
      
      // Role ke basis par appropriate model se user find karenge
      if (role === "Admin" || role === "admin") {
        console.log('🔐 Looking up Admin in database...');
        user = await Admin.findById(decoded.id).select("-password"); // Password exclude kar rahe hain
        if (user) user.role = "Admin"; // Role set kar rahe hain
      } else if (role === "Teacher" || role === "teacher") {
        console.log('🔐 Looking up Teacher in database...');
        user = await Teacher.findById(decoded.id).select("-password");
        if (user) user.role = "Teacher";
      } else if (role === "Student" || role === "student") {
        console.log('🔐 Looking up Student in database...');
        user = await Student.findById(decoded.id).select("-password");
        if (user) user.role = "Student";
      } else {
        // Invalid role hai to error
        console.log('❌ Invalid role:', role);
        return res.status(401).json({ message: "Invalid user role" });
      }

      // Agar user database mein nahi mila to error
      if (!user) {
        console.log('❌ User not found in database for role:', role);
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // ✅ SUCCESS: User info ko request object mein attach kar rahe hain
      // Ab agle functions mein req.user se user ki details mil jayengi
      req.user = user;
      req.user.id = user._id.toString(); // Add id field for compatibility
      console.log('✅ User authenticated:', req.user.name, '| Role:', req.user.role);
      next(); // Next middleware/controller function par jaenge
    } else {
      // Authorization header nahi mila to error
      console.log('❌ No authorization header');
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    // Token verification fail ho gaya to error
    console.error("❌ Protect middleware error:", error.message);
    return res.status(401).json({
      message: "Not authorized, token failed or malformed",
    });
  }
};

// 🛡️ ROLE-BASED AUTHORIZATION - specific roles ko hi access dene ke liye
// Example: authorizeRoles("Admin", "Teacher") - sirf Admin aur Teacher access kar sakte hain
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Current user ka role get kar rahe hain (lowercase mein convert karke)
    const userRole = req.user?.role?.toLowerCase();
    // Allowed roles ko bhi lowercase mein convert kar rahe hain
    const allowedRoles = roles.map(role => role.toLowerCase());
    
    console.log('🔐 Auth Debug - User role:', req.user?.role, '| Allowed roles:', roles);
    
    // Check kar rahe hain ki user ka role allowed roles mein hai ya nahi
    if (!req.user || !allowedRoles.includes(userRole)) {
      console.log('❌ Access denied. User role:', userRole, '| Allowed:', allowedRoles);
      return res.status(403).json({
        message: `Only ${roles.join("/")} can access this route`,
      });
    }
    
    // Agar role match karta hai to next function par jaenge
    console.log('✅ Access granted');
    next();
  };
};
