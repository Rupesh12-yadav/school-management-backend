import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "teachers" },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "admins" },
  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  attachment: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true }
}, { timestamps: true });

export default mongoose.model("leaverequest", leaveRequestSchema, "leaverequests");
