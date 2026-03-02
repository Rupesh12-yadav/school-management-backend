import ExamResult from "../models/ExamResult.js";
import Exam from "../models/Exam.js";

/* ================================
   1️⃣ Create / Post Exam Result
   (Teacher only)
   Supports both single student and bulk upload
================================ */
export const postExamResult = async (req, res) => {
  try {
    const { examId, examName: examNameFromBody, subject, class: studentClass, section, totalMarks, marks } = req.body;
    const teacherId = req.user._id || req.user.id;
    const adminId = req.user.adminId || req.user.id;

    // marks is an array of { studentId, marksObtained }
    if (!Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Marks array is required",
      });
    }

    // Create results for each student
    const results = [];
    
    // Get exam details if examId is provided
    let examName = examNameFromBody || "";
    if (!examName && examId && examId !== "") {
      const exam = await Exam.findById(examId);
      if (exam) {
        examName = exam.examName || exam.subjectName || "";
      }
    }
    
    for (const markEntry of marks) {
      const result = await ExamResult.create({
        exam: examId && examId !== "" ? examId : null,
        examName: examName,
        student: markEntry.studentId,
        subject: subject,
        class: studentClass,
        section: section,
        marksObtained: markEntry.marksObtained,
        totalMarks: markEntry.totalMarks || totalMarks,
        grade: calculateGrade(markEntry.marksObtained, markEntry.totalMarks || totalMarks),
        teacher: teacherId,
        createdBy: adminId,
      });
      results.push(result);

      // Update Exam model if examId is provided
      if (examId && examId !== "") {
        await Exam.findByIdAndUpdate(examId, {
          $push: {
            marks: {
              student: markEntry.studentId,
              mark: markEntry.marksObtained,
              grade: calculateGrade(markEntry.marksObtained, markEntry.totalMarks || totalMarks),
            },
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Exam results added successfully",
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Error posting exam result:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to calculate grade
function calculateGrade(marks, totalMarks) {
  const percentage = (marks / totalMarks) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  return 'F';
}

/* ================================
   2️⃣ Get All Exam Results (Teacher)
================================ */
export const getAllExamResults = async (req, res) => {
  try {
    const teacherId = req.user._id || req.user.id;

    const results = await ExamResult.find({ teacher: teacherId })
      .populate("student", "name lastname rollNumber class section")
      .populate("exam", "subjectName examDate totalMarks")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   3️⃣ Get Single Exam Result by ID
================================ */
export const getExamResultById = async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.id)
      .populate("student", "name lastname rollNumber class section")
      .populate("exam", "subjectName examDate examDay totalMarks")
      .populate("teacher", "name email");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Exam result not found",
      });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   4️⃣ Update Exam Result
   (Teacher / Admin)
================================ */
export const updateExamResult = async (req, res) => {
  try {
    const { marksObtained, grade } = req.body;
    const { id } = req.params;

    // Recalculate grade if marksObtained is provided
    let newGrade = grade;
    if (marksObtained !== undefined) {
      const result = await ExamResult.findById(id);
      if (result) {
        newGrade = calculateGrade(marksObtained, result.totalMarks);
      }
    }

    const updatedResult = await ExamResult.findByIdAndUpdate(
      id,
      { marksObtained, grade: newGrade },
      { new: true }
    );

    if (!updatedResult) {
      return res.status(404).json({
        success: false,
        message: "Exam result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam result updated successfully",
      result: updatedResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   5️⃣ Delete Exam Result
   (Admin only)
================================ */
export const deleteExamResult = async (req, res) => {
  try {
    const result = await ExamResult.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Exam result not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Exam result deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   6️⃣ Get All Results (Admin/Student)
================================ */
export const getAllResults = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;
    
    let query = {};
    if (userRole === 'Student') {
      query = { student: userId };
    }
    
    const results = await ExamResult.find(query)
      .populate("student", "name lastname rollNumber class section")
      .populate("exam", "subjectName examDate totalMarks")
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
