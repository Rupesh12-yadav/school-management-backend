import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema({
  class: { type: String, required: true },
  section: { type: String, required: true },
  academicYear: { type: String, required: true },
  fees: {
    tuition: { type: Number, required: true, default: 0 },
    transport: { type: Number, default: 0 },
    library: { type: Number, default: 0 },
    sports: { type: Number, default: 0 },
    exam: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  totalAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true }
}, { timestamps: true });

feeStructureSchema.pre("save", function(next) {
  this.totalAmount = Object.values(this.fees).reduce((sum, val) => sum + val, 0);
  next();
});

const FeeStructure = mongoose.model("feestructures", feeStructureSchema);
export default FeeStructure;
