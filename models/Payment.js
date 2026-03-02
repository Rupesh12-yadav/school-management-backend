import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
  feeStructure: { type: mongoose.Schema.Types.ObjectId, ref: "feestructures", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Cash", "Online", "Cheque", "Card"], required: true },
  transactionId: { type: String },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Completed" },
  receiptNumber: { type: String, unique: true, required: true },
  remarks: { type: String },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true }
}, { timestamps: true });

paymentSchema.pre("save", async function(next) {
  if (!this.receiptNumber) {
    const count = await mongoose.models.payments.countDocuments();
    this.receiptNumber = `REC${Date.now()}${count + 1}`;
  }
  next();
});

const Payment = mongoose.model("payments", paymentSchema);
export default Payment;
