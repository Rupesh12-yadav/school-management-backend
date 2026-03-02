import mongoose from "mongoose";

const teacherAttendanceSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "teachers", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Present", "Absent", "Leave"], required: true },
  remarks: { type: String },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true }
}, { timestamps: true });

const TeacherAttendance = mongoose.model("teacherattendance", teacherAttendanceSchema, "teacherattendances");
export default TeacherAttendance;
