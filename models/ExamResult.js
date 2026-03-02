// backend/models/ExamResult.js
import mongoose from "mongoose";

const examResultSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", default: null },
  examName: { type: String, default: "" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  grade: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "teachers", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", default: null }
}, { timestamps: true });

export default mongoose.model("examresult", examResultSchema, "examresults");
