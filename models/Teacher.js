// Mongoose library import kar rahe hain - MongoDB ke saath kaam karne ke liye
import mongoose from "mongoose";
// bcrypt library import kar rahe hain - password ko encrypt karne ke liye
import bcrypt from "bcryptjs";

// Teacher ka database schema define kar rahe hain
const teacherSchema = new mongoose.Schema(
  {
    // Teacher ki basic information
    name: { type: String, required: true },                    // Teacher ka naam (required)
    email: { type: String, required: true, unique: true },     // Email address (unique hona chahiye)
    password: { type: String, required: true },                // Login password
    role: { type: String, default: "Teacher" },                // User role (default "Teacher")
    mobile: { type: String, unique: true },                    // Mobile number (unique)
    location: { type: String },                                // Teacher ka location/address
    experience: { type: Number },                              // Kitne saal ka experience hai
    subjects: [String],                                        // Konse subjects padhate hain (array)

    // Teacher ko kisne add kiya
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true },

    // Teacher ke relationships with other entities
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "students" }],           // Assigned students
    homeworkCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "homeworks" }],   // Created homework
    marksUploaded: [{ type: mongoose.Schema.Types.ObjectId, ref: "exams" }],         // Uploaded exam marks
    leaveRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "leaverequests" }], // Received leave requests
    Attentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "teacherattendance" }], // Attendance records
  },
  { timestamps: true } // createdAt aur updatedAt automatically add ho jayenge
);

// Password hashing middleware - password ko save karne se pehle encrypt kar denge
teacherSchema.pre("save", async function (next) {
  // Agar password modify nahi hua hai to skip kar denge
  if (!this.isModified("password")) return next();
  
  // Password ko bcrypt se hash kar rahe hain (10 rounds of salting)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password verification method - login ke time password check karne ke liye
teacherSchema.methods.matchPassword = async function (enteredPassword) {
  // User ka entered password aur database mein stored password ko compare karenge
  return await bcrypt.compare(enteredPassword, this.password);
};

// Teacher model create kar rahe hain aur export kar rahe hain
const Teacher = mongoose.model("teachers", teacherSchema, "teachers");
export default Teacher;
