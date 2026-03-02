import Notice from "../models/Notice.js";
import Admin from "../models/Admin.js";
import cloudinary from "../config/cloudinary.js";

// 📌 Create Notice
export const createNotice = async (req, res) => {
  try {
    const { title, description, audience, isImportant, expiryDate, image } = req.body;
    const createdBy = req.user._id;

    console.log('Received image:', image);

    const notice = await Notice.create({
      title,
      description,
      image: image || null,
      createdBy,
      audience: audience || "All",
      isImportant: isImportant || false,
      expiryDate,
    });

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(400).json({
      success: false,
      message: "Error creating notice",
      error: error.message,
    });
  }
};

// 📌 Get All Notices
export const getAllNotices = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let query = {};
    // Admin sees all notices, others see all notices too (no filter needed)
    // Teacher and Student can see all notices
    
    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notices",
      error: error.message,
    });
  }
};

// 📌 Get Single Notice by ID
export const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate("createdBy", "name email");
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }
    res.status(200).json({
      success: true,
      notice,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid Notice ID",
      error: error.message,
    });
  }
};

// 📌 Update Notice
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      notice,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating notice",
      error: error.message,
    });
  }
};

// 📌 Delete Notice
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting notice",
      error: error.message,
    });
  }
};
