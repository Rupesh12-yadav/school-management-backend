import express from "express";
import {
  createFeeStructure,
  getAllFeeStructures,
  getFeeByClassSection,
  updateFeeStructure,
  deleteFeeStructure,
  recordPayment,
  getStudentPayments,
  getAllPayments,
  getPendingFees,
  getReceipt
} from "../controllers/feeController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/structure", protect, authorizeRoles("Admin"), createFeeStructure);
router.get("/structure", protect, authorizeRoles("Admin"), getAllFeeStructures);
router.get("/structure/:class/:section", protect, getFeeByClassSection);
router.put("/structure/:id", protect, authorizeRoles("Admin"), updateFeeStructure);
router.delete("/structure/:id", protect, authorizeRoles("Admin"), deleteFeeStructure);

// Payment routes
router.post("/payment", protect, authorizeRoles("Admin"), recordPayment);
router.get("/payments", protect, authorizeRoles("Admin"), getAllPayments);
router.get("/payments/student/:studentId", protect, getStudentPayments);
router.get("/pending", protect, authorizeRoles("Admin"), getPendingFees);
router.get("/receipt/:id", protect, getReceipt);

export default router;
