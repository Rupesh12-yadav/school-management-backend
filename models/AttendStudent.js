import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Present", "Absent", "Leave"], required: true },
  remarks: { type: String },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: false }
}, { timestamps: true });

const Attendance = mongoose.model("studentAttendance", attendanceSchema, "studentattendances");
export default Attendance;
