// Required models aur utilities import kar rahe hain
import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";
import generateToken from "../utils/generateToken.js";

// 📝 ADMIN REGISTRATION - Naya admin create karne ke liye
export const registerAdmin = async (req, res) => {
  const { name, email, password, role, domain } = req.body;

  try {
    // Check karte hain ki admin already exist to nahi karta
    const userExists = await Admin.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Naya admin create karte hain
    const user = await Admin.create({ name, email, password, role, domain });

    // Success response bhejte hain token ke saath
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      domain: user.domain,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// 🔑 LOGIN CONTROLLER - Saare users (Admin, Teacher, Student) ke liye
export const loginAdmin = async (req, res) => {
  console.log("Login attempt started");
  const { email, password } = req.body;
  console.log("Email received:", email);

  try {
    let user;
    let role;

    // 🔍 Step 1: Admin mein check karte hain
    console.log("Checking Admin...");
    user = await Admin.findOne({ email });
    if (user) {
      console.log("User found in Admin");
      role = "Admin";
    }

    // 🔍 Step 2: Teacher mein check karte hain
    if (!user) {
      console.log("Checking Teacher...");
      user = await Teacher.findOne({ email });
      if (user) {
        console.log("User found in Teacher");
        role = "Teacher";
      }
    }

    // 🔍 Step 3: Student mein check karte hain
    if (!user) {
      console.log("Checking Student...");
      user = await Student.findOne({ email });
      if (user) {
        console.log("User found in Student");
        role = "Student";
      }
    }

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔐 Password verify karte hain
    console.log("Verifying password...");
    const isMatch = await user.matchPassword(password);
    console.log("Password match:", isMatch);
    
    if (isMatch) {
      console.log("Login successful for:", role);
      let successMessage = `Welcome ${role} ${user.name}! You have successfully logged in.`;

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        token: generateToken(user._id, role),
        message: successMessage
      });
    } else {
      console.log("Password mismatch");
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🛡️ PROTECTED ROUTE CONTROLLERS
export const adminOnly = (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.name}` });
}

export const studentOnly = (req, res) => {
  res.json({ message: `Welcome Student ${req.user.name}` });
}

export const teacherOnly = (req, res) => {
  res.json({ message: `Welcome Teacher ${req.user.name}` });
}

// ========== ADMIN CRUD OPERATIONS ==========

// 📋 GET ALL ADMINS - Saare admins ki list
export const getAllAdmins = async (req, res) => {
  try {
    // Saare admins find karte hain, password exclude karte hain
    const admins = await Admin.find({}).select('-password');
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 GET SINGLE ADMIN - Specific admin ki details
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📝 CREATE NEW ADMIN - Naya admin add karna
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, domain } = req.body;
    
    // Check karte hain ki email already exist to nahi karta
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
    }
    
    // Naya admin create karte hain
    const admin = await Admin.create({
      name,
      email,
      password,
      domain,
      role: 'Admin'
    });
    
    // Password field remove karte hain response se
    const adminResponse = await Admin.findById(admin._id).select('-password');
    
    res.status(201).json({ 
      success: true, 
      message: 'Admin created successfully',
      data: adminResponse 
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Email already exists' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// ✏️ UPDATE ADMIN - Admin ki information update karna
export const updateAdmin = async (req, res) => {
  try {
    const { name, email, domain } = req.body;
    
    // Admin find karte hain aur update karte hain
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, email, domain },
      { 
        new: true,           // Updated document return karo
        runValidators: true  // Schema validation check karo
      }
    ).select('-password');
    
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: admin
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Email already exists' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// 🗑️ DELETE ADMIN - Admin ko delete karna
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📊 ADMIN DASHBOARD DATA - Dashboard ke liye saara data
export const getAdminDashboardData = async (req, res) => {
  try {
    // Parallel mein saare counts fetch karte hain
    const [adminCount, teacherCount, studentCount] = await Promise.all([
      Admin.countDocuments(),
      Teacher.countDocuments(),
      Student.countDocuments()
    ]);
    
    // Recent admins fetch karte hain
    const recentAdmins = await Admin.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        counts: {
          admins: adminCount,
          teachers: teacherCount,
          students: studentCount,
          total: adminCount + teacherCount + studentCount
        },
        recentAdmins
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📚 GET ADMIN ASSIGNED CLASSES - Admin ke assigned classes fetch karna
export const getAdminClasses = async (req, res) => {
  try {
    const adminId = req.user.id;
    const classes = await Class.find({ createdBy: adminId }).select('name section grade');
    res.status(200).json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};