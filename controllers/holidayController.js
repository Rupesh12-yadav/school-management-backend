import Holiday from "../models/Holiday.js";

export const getAllHolidays = async (req, res) => {
  try {
    const adminId = req.user.id;
    const holidays = await Holiday.find({ createdBy: adminId }).sort({ date: 1 });
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHoliday = async (req, res) => {
  try {
    const adminId = req.user.id;
    const holidayData = { ...req.body, createdBy: adminId };
    const holiday = await Holiday.create(holidayData);
    res.status(201).json({ success: true, holiday });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Holiday deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};