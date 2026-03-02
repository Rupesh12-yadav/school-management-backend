// Class model import kar rahe hain
import Class from "../models/Class.js";

// ========== CLASS MANAGEMENT FUNCTIONS ==========

// 📋 GET ALL CLASSES - Saari classes ki list
export const getAllClasses = async (req, res) => {
  try {
    const adminId = req.user.id;
    const classes = await Class.find({ createdBy: adminId })
      .populate("classTeacher", "name email subjects")
      .sort({ grade: 1, section: 1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, section, grade, classTeacher, subjects, capacity, schedule } = req.body;

    if (!name || !section || !grade) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, section, and grade are required" 
      });
    }

    const existingClass = await Class.findOne({ name, section, createdBy: adminId });
    if (existingClass) {
      return res.status(400).json({ 
        success: false, 
        message: "Class with same name and section already exists" 
      });
    }

    const newClass = await Class.create({
      name,
      section,
      grade,
      classTeacher,
      subjects,
      capacity: capacity || 40,
      schedule,
      createdBy: adminId
    });

    const populatedClass = await Class.findById(newClass._id)
      .populate("classTeacher", "name email subjects");

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: populatedClass
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ UPDATE CLASS - Class ki information update karne ke liye
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log("Update Class ID:", id);
    console.log("Update Data:", updates);

    // Class find karke update karte hain
    const updatedClass = await Class.findByIdAndUpdate(id, updates, { 
      new: true,
      runValidators: true
    }).populate("classTeacher", "name email subjects");

    if (!updatedClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }
    
    console.log("Class Updated:", updatedClass);

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: updatedClass
    });
  } catch (error) {
    console.error("Update Class Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ DELETE CLASS - Class ko delete karne ke liye
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔍 GET SINGLE CLASS - Specific class ki details
export const getClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classData = await Class.findById(id)
      .populate("classTeacher", "name email subjects")
      .populate("students", "name lastname rollNumber class section");

    if (!classData) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🏠 CREATE PREDEFINED CLASSES - Admin ke liye predefined classes
export const createPredefinedClasses = async (req, res) => {
  try {
    // Pehle check karte hain ki classes already exist to nahi karti
    const existingClasses = await Class.countDocuments();
    if (existingClasses > 0) {
      return res.status(400).json({
        success: false,
        message: "Classes already exist. Please delete existing classes first."
      });
    }

    // Predefined classes ka data
    const predefinedClasses = [
      {
        name: "1st A",
        section: "A",
        grade: "1st",
        subjects: ["English", "Math", "Hindi", "EVS"],
        capacity: 30,
        room: "101",
        schedule: { startTime: "09:00", endTime: "14:00" }
      },
      {
        name: "2nd A",
        section: "A",
        grade: "2nd",
        subjects: ["English", "Math", "Hindi", "EVS"],
        capacity: 30,
        room: "102",
        schedule: { startTime: "09:00", endTime: "14:00" }
      },
      {
        name: "3rd A",
        section: "A",
        grade: "3rd",
        subjects: ["English", "Math", "Hindi", "EVS", "Computer"],
        capacity: 35,
        room: "201",
        schedule: { startTime: "09:00", endTime: "14:30" }
      },
      {
        name: "4th A",
        section: "A",
        grade: "4th",
        subjects: ["English", "Math", "Hindi", "Science", "Social Studies"],
        capacity: 35,
        room: "202",
        schedule: { startTime: "09:00", endTime: "14:30" }
      },
      {
        name: "5th A",
        section: "A",
        grade: "5th",
        subjects: ["English", "Math", "Hindi", "Science", "Social Studies"],
        capacity: 35,
        room: "301",
        schedule: { startTime: "09:00", endTime: "15:00" }
      },
      {
        name: "6th A",
        section: "A",
        grade: "6th",
        subjects: ["English", "Math", "Hindi", "Science", "Social Studies", "Computer"],
        capacity: 40,
        room: "302",
        schedule: { startTime: "09:00", endTime: "15:00" }
      },
      {
        name: "7th A",
        section: "A",
        grade: "7th",
        subjects: ["English", "Math", "Hindi", "Science", "Social Studies", "Computer"],
        capacity: 40,
        room: "401",
        schedule: { startTime: "09:00", endTime: "15:30" }
      },
      {
        name: "8th A",
        section: "A",
        grade: "8th",
        subjects: ["English", "Math", "Hindi", "Science", "Social Studies", "Computer"],
        capacity: 40,
        room: "402",
        schedule: { startTime: "09:00", endTime: "15:30" }
      },
      {
        name: "9th A",
        section: "A",
        grade: "9th",
        subjects: ["English", "Math", "Hindi", "Physics", "Chemistry", "Biology", "History", "Geography"],
        capacity: 45,
        room: "501",
        schedule: { startTime: "08:30", endTime: "16:00" }
      },
      {
        name: "10th A",
        section: "A",
        grade: "10th",
        subjects: ["English", "Math", "Hindi", "Physics", "Chemistry", "Biology", "History", "Geography"],
        capacity: 45,
        room: "502",
        schedule: { startTime: "08:30", endTime: "16:00" }
      },
      {
        name: "11th Science",
        section: "A",
        grade: "11th",
        subjects: ["English", "Math", "Physics", "Chemistry", "Biology", "Computer Science"],
        capacity: 40,
        room: "601",
        schedule: { startTime: "08:00", endTime: "16:30" }
      },
      {
        name: "12th Science",
        section: "A",
        grade: "12th",
        subjects: ["English", "Math", "Physics", "Chemistry", "Biology", "Computer Science"],
        capacity: 40,
        room: "602",
        schedule: { startTime: "08:00", endTime: "16:30" }
      }
    ];

    // Saari predefined classes create karte hain
    const createdClasses = await Class.insertMany(predefinedClasses);

    res.status(201).json({
      success: true,
      message: `${createdClasses.length} predefined classes created successfully`,
      data: createdClasses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ DELETE ALL CLASSES - Saari classes delete karne ke liye
export const deleteAllClasses = async (req, res) => {
  try {
    const result = await Class.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} classes deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};