// backend/models/Exam.js
import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "teachers", required: true },
  subjectName: { type: String, required: true },
  examDate: { type: Date, required: true },
  examDay: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  class: { type: String },
  section: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  marks: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "students" },
      mark: Number,
      grade: String
    }
  ]
}, { timestamps: true });

export default mongoose.model("Exam", examSchema, "exams");
