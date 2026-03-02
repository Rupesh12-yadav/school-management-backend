import mongoose from "mongoose";
import TeacherAttendance from "../models/AttendTeacher.js";
import Teacher from "../models/Teacher.js";

// 📝 Mark Teacher Attendance
export const addTeacherAttendance = async (req, res) => {
  try {
    const { teacherId, status, remarks, date } = req.body;
    const adminId = req.user.id;

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ success: false, message: "Invalid teacherId" });
    }

    const teacherExists = await Teacher.findById(teacherId);
    if (!teacherExists) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    if (!status || !["Present", "Absent", "Leave"].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status is required (Present/Absent/Leave)" });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const existingAttendance = await TeacherAttendance.findOne({
      teacher: teacherId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ success: false, message: "Attendance already marked for this date" });
    }

    const attendance = await TeacherAttendance.create({
      teacher: teacherId,
      date: attendanceDate,
      status,
      remarks,
      markedBy: adminId
    });

    const populatedAttendance = await TeacherAttendance.findById(attendance._id).populate('teacher', 'name email subjects');

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

// 📋 Get Teacher Attendance by ID
export const getTeacherAttendance = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ success: false, message: "Invalid teacherId" });
    }

    const attendance = await TeacherAttendance.find({ teacher: teacherId })
      .populate('teacher', 'name email subjects')
      .sort({ date: -1 });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "No attendance found" });
    }

    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 📊 Get All Teachers Attendance
export const getAllTeachersAttendance = async (req, res) => {
  try {
    const attendance = await TeacherAttendance.find()
      .populate('teacher', 'name email subjects')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// ✏️ Update Teacher Attendance
export const updateTeacherAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid attendance ID" });
    }

    if (status && !["Present", "Absent", "Leave"].includes(status)) {
      return res.status(400).json({ success: false, message: "Valid status is required (Present/Absent/Leave)" });
    }

    const attendance = await TeacherAttendance.findByIdAndUpdate(
      id,
      { status, remarks },
      { new: true, runValidators: true }
    ).populate('teacher', 'name email subjects');

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, message: "Attendance updated successfully", data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 🗑️ Delete Teacher Attendance
export const deleteTeacherAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid attendance ID" });
    }

    const attendance = await TeacherAttendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, message: "Attendance deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
