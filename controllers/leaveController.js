import LeaveRequest from "../models/LeaveRequest.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";

export const createLeaveRequest = async (req, res) => {
  try {
    const { fromDate, toDate, reason, attachment } = req.body;
    const studentId = req.user.id;
    const adminId = req.user.adminId || req.user.id;

    const teachers = await Teacher.find({ createdBy: adminId }).limit(1);
    const admins = await Admin.findById(adminId);

    const leave = await LeaveRequest.create({
      requester: studentId,
      teacher: teachers[0]?._id,
      admin: adminId,
      fromDate,
      toDate,
      reason,
      attachment,
      status: "Pending",
      createdBy: adminId
    });

    await Student.findByIdAndUpdate(studentId, {
      $push: { leaveRequests: leave._id }
    });

    res.status(201).json({ message: "Leave request submitted successfully", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const studentId = req.user.id;
    const leaves = await LeaveRequest.find({ requester: studentId })
      .populate("teacher", "name")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = {};
    if (userRole === 'Admin') {
      query = { createdBy: userId };
    }
    // Teacher can see all leaves
    
    const leaves = await LeaveRequest.find(query)
      .populate({
        path: "requester",
        select: "name lastname class section email phoneNumber",
        model: "students"
      })
      .populate({
        path: "teacher",
        select: "name"
      })
      .populate({
        path: "admin",
        select: "name"
      })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = {};
    if (userRole === 'Admin') {
      query = { createdBy: userId };
    }
    // Teacher can see all leaves
    
    const leaves = await LeaveRequest.find(query)
      .populate({
        path: "requester",
        select: "name lastname class section email phoneNumber",
        model: "students"
      })
      .populate({
        path: "teacher",
        select: "name"
      })
      .populate({
        path: "admin",
        select: "name"
      })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};