import FeeStructure from "../models/FeeStructure.js";
import Payment from "../models/Payment.js";
import Student from "../models/Student.js";

// Fee Structure create karna
export const createFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: feeStructure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Saare fee structures get karna
export const getAllFeeStructures = async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, data: feeStructures });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Class aur section ke basis par fee structure get karna
export const getFeeByClassSection = async (req, res) => {
  try {
    const { class: className, section } = req.params;
    const feeStructure = await FeeStructure.findOne({ class: className, section });
    if (!feeStructure) {
      return res.status(404).json({ success: false, message: "Fee structure not found" });
    }
    res.status(200).json({ success: true, data: feeStructure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Fee structure update karna
export const updateFeeStructure = async (req, res) => {
  try {
    const feeStructure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: feeStructure });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Fee structure delete karna
export const deleteFeeStructure = async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Fee structure deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Payment record karna
export const recordPayment = async (req, res) => {
  try {
    const payment = await Payment.create({ ...req.body, collectedBy: req.user._id });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Student ke saare payments get karna
export const getStudentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.studentId })
      .populate("feeStructure")
      .populate("collectedBy", "name");
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Saare payments get karna
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student", "name lastname rollNumber class section")
      .populate("feeStructure")
      .populate("collectedBy", "name");
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Pending fees wale students get karna
export const getPendingFees = async (req, res) => {
  try {
    const students = await Student.find();
    const feeStructures = await FeeStructure.find();
    const payments = await Payment.find({ status: "Completed" });

    const pendingList = [];
    
    for (const student of students) {
      const feeStructure = feeStructures.find(
        f => f.class === student.class && f.section === student.section
      );
      
      if (feeStructure) {
        const totalPaid = payments
          .filter(p => p.student.toString() === student._id.toString())
          .reduce((sum, p) => sum + p.amount, 0);
        
        const pending = feeStructure.totalAmount - totalPaid;
        
        if (pending > 0) {
          pendingList.push({
            student: { 
              _id: student._id, 
              name: student.name, 
              lastname: student.lastname,
              rollNumber: student.rollNumber,
              class: student.class,
              section: student.section
            },
            totalFee: feeStructure.totalAmount,
            paidAmount: totalPaid,
            pendingAmount: pending,
            dueDate: feeStructure.dueDate
          });
        }
      }
    }
    
    res.status(200).json({ success: true, data: pendingList });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Receipt download karna
export const getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("student", "name lastname rollNumber class section")
      .populate("feeStructure")
      .populate("collectedBy", "name");
    
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
