// backend/models/Notice.js
import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
   image: {
        url: String,
        public_id: String
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true },
    audience: { type: String, enum: ["All", "Students", "Teachers"], default: "All" },
    isImportant: { type: Boolean, default: false },
    expiryDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("notice", noticeSchema, "notices");
