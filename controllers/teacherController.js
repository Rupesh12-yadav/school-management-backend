import Teacher from "../models/Teacher.js";
import Exam from "../models/Exam.js";
import Class from "../models/Class.js";
import Student from "../models/Student.js";

// Create Teacher
export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, mobile, location, experience, subjects } = req.body;
    const adminId = req.user.id;

    const existingTeacher = await Teacher.findOne({ $or: [{ email }, { mobile }] });
    if (existingTeacher) return res.status(400).json({ error: "Email or Mobile already exists" });

    const newTeacher = await Teacher.create({
      name,
      email,
      password,
      mobile,
      location,
      experience,
      subjects,
      createdBy: adminId
    });

    res.status(201).json({ message: "Teacher created successfully", teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    // Return all teachers for admin dashboard
    const teachers = await Teacher.find().select('-password');
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Teacher
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Teacher's Assigned Students
// Modified to return ALL students for attendance marking purposes
export const getTeacherStudents = async (req, res) => {
  try {
    const teacherId = req.user._id || req.user.id;
    
    // First, try to get students from classes where teacher is classTeacher
    const classes = await Class.find({ classTeacher: teacherId });
    const classIds = classes.map(c => c._id);
    
    let students;
    
    if (classIds.length > 0) {
      // Get students from assigned classes
      students = await Student.find({ 
        _id: { $in: classes.flatMap(c => c.students) }
      }).select('name lastname class section rollNumber email');
    } else {
      // If no classes assigned, return ALL students for attendance marking
      students = await Student.find()
        .select('name lastname class section rollNumber email');
    }
    
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching teacher students:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Teacher's Assigned Subjects
export const getTeacherSubjects = async (req, res) => {
  try {
    const teacherId = req.user._id || req.user.id;
    const teacher = await Teacher.findById(teacherId).select('subjects');
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    
    // Also get subjects from classes where teacher is assigned
    const classes = await Class.find({ classTeacher: teacherId });
    const classSubjects = classes.flatMap(c => c.subjects || []);
    const allSubjects = [...new Set([...teacher.subjects, ...classSubjects])];
    
    res.status(200).json(allSubjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Teacher's Available Classes
// Modified to return ALL classes if no classes are assigned
export const getTeacherClasses = async (req, res) => {
  try {
    const teacherId = req.user._id || req.user.id;
    
    // Find classes where this teacher is the classTeacher
    const classes = await Class.find({ classTeacher: teacherId });
    
    let classNames;
    
    if (classes.length > 0) {
      classNames = classes.map(c => c.name);
    } else {
      // If no classes assigned, return ALL classes for teacher to use
      const allClasses = await Class.find({}, 'name');
      classNames = allClasses.map(c => c.name);
    }
    
    res.status(200).json(classNames.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Teacher's Available Sections
export const getTeacherSections = async (req, res) => {
  try {
    const teacherId = req.user._id || req.user.id;
    
    // Find classes where this teacher is the classTeacher
    const classes = await Class.find({ classTeacher: teacherId });
    const sections = classes.map(c => c.section).filter(Boolean);
    
    res.status(200).json([...new Set(sections)].sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Teacher's Exams
export const getTeacherExams = async (req, res) => {
  try {
    const teacherId = req.user._id || req.user.id;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    
    const teacherSubjects = teacher.subjects || [];
    
    // Get exams for teacher's subjects from classes they teach
    const classes = await Class.find({ classTeacher: teacherId });
    const classSubjects = classes.flatMap(c => c.subjects || []);
    const allSubjects = [...new Set([...teacherSubjects, ...classSubjects])];
    
    const exams = await Exam.find({ subjectName: { $in: allSubjects } });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If password is being updated, it will be hashed by the pre-save middleware
    // If password is not in the request, remove it from update
    if (!updateData.password) {
      delete updateData.password;
    }
    
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
