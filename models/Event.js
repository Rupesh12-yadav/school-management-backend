// backend/models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true },
    audience: { type: String, enum: ["All", "Students", "Teachers"], default: "All" },
    isHoliday: { type: Boolean, default: false },
    location: { type: String },
}, { timestamps: true });

export default mongoose.model("event", eventSchema, "events");
