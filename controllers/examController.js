// backend/controllers/examController.js
import Exam from "../models/Exam.js";

// Create/Post Exam
export const createExam = async (req, res) => {
  try {
    const { subjectName, examDate, examDay, totalMarks, marks, class: examClass, section } = req.body;
    const teacherId = req.user._id || req.user.id;

    const newExam = await Exam.create({
      teacher: teacherId,
      subjectName,
      examDate,
      examDay,
      totalMarks,
      class: examClass,
      section,
      marks: marks || [],
      createdBy: teacherId
    });

    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllExams = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;
    const userClass = req.user.class;
    const userSection = req.user.section;
    
    let query = {};
    if (userRole === 'Teacher') {
      query = { teacher: userId };
    } else if (userRole === 'Student') {
      // For students, filter by their class and section
      if (userClass) {
        query.class = userClass;
        if (userSection) {
          query.section = userSection;
        }
      }
    }
    
    const exams = await Exam.find(query).populate("teacher", "name email").sort({ examDate: 1 });
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single Exam by ID
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("marks.student", "name email");
    if (!exam) return res.status(404).json({ success: false, message: "Exam not found" });
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Exam
export const updateExam = async (req, res) => {
  try {
    const { subjectName, examDate, examDay, totalMarks, marks } = req.body;

    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { subjectName, examDate, examDay, totalMarks, marks },
      { new: true }
    );

    if (!updatedExam)
      return res.status(404).json({ success: false, message: "Exam not found" });

    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Exam
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam)
      return res.status(404).json({ success: false, message: "Exam not found" });

    res.status(200).json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
