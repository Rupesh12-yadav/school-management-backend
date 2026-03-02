import mongoose from "mongoose";
import Attendance from "../models/AttendStudent.js";
import Student from "../models/Student.js";

// 📝 Mark Student Attendance
export const addStudentAttendance = async (req, res) => {
  try {
    const { studentId, status, remarks, date } = req.body;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid studentId" });
    }

    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (!status || !["Present", "Absent", "Leave"].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status is required (Present/Absent/Leave)" });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.remarks = remarks;
      await existingAttendance.save();
      const updated = await Attendance.findById(existingAttendance._id).populate('student', 'name lastname rollNumber class section');
      return res.status(200).json({ 
        success: true, 
        message: "Attendance updated successfully", 
        data: updated 
      });
    }

    const attendance = await Attendance.create({
      student: studentId,
      date: attendanceDate,
      status,
      remarks,
      markedBy: req.user._id || req.user.id
    });

    const populatedAttendance = await Attendance.findById(attendance._id).populate('student', 'name lastname rollNumber class section');

    res.status(201).json({ 
      success: true, 
      message: "Attendance marked successfully", 
      data: populatedAttendance 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 📋 Get Student Attendance by ID
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ success: false, message: "Invalid studentId" });
    }

    const attendance = await Attendance.find({ student: studentId })
      .populate('student', 'name lastname rollNumber class section')
      .sort({ date: -1 });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "No attendance found" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 📊 Get All Students Attendance
export const getAllStudentsAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('student', 'name lastname rollNumber class section')
      .sort({ date: -1 });

    // Return as array directly
    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✏️ Update Student Attendance
export const updateStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid attendance ID" });
    }

    if (status && !["Present", "Absent", "Leave"].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status is required (Present/Absent/Leave)" });
    }

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true, runValidators: true }
    ).populate('student', 'name lastname rollNumber class section');

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, message: "Attendance updated successfully", data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 🗑️ Delete Student Attendance
export const deleteStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid attendance ID" });
    }

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, message: "Attendance deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
