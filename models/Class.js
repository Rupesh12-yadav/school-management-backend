import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    section: { type: String, required: true },
    grade: { type: String, required: true },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "teachers" },
    subjects: [{ type: String }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
    capacity: { type: Number, default: 40 },
    room: { type: String },
    schedule: {
        startTime: String,
        endTime: String
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true }
}, { timestamps: true });

export default mongoose.model("class", classSchema, "classes");