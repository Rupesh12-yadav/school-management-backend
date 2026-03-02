// backend/models/Homework.js
import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "teachers" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],
    dueDate: Date,
    subject: String,
    classSection: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true });

export default mongoose.model("homework", homeworkSchema, "homeworks");
