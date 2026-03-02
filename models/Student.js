// Mongoose library import kar rahe hain - MongoDB ke saath kaam karne ke liye
import mongoose from "mongoose";
// bcrypt library import kar rahe hain - password ko encrypt karne ke liye
import bcrypt from "bcryptjs";

// Student ka database schema define kar rahe hain - ye batata hai ki student record mein kya fields honge
const studentSchema = new mongoose.Schema({
  // Student ki basic information
  name: { type: String, required: true },                    // Student ka first name (required field)
  lastname: { type: String, required: true },               // Student ka last name (required field)
  email: { type: String, required: true, unique: true },    // Email address (unique hona chahiye)
  password: { type: String, required: true },               // Login password (encrypted form mein store hoga)
  mobile: { type: String, unique: true, sparse: true },     // Mobile number (optional but unique)
  role: { type: String, default: "Student" },               // User role (default "Student")

  // Student ki academic information
  class: { type: String, required: true },                  // Konsi class mein hai (e.g., "10th", "12th")
  section: { type: String, required: true },                // Konsa section (e.g., "A", "B", "C")
  rollNumber: { type: String, required: true, unique: true }, // Roll number (unique hona chahiye)

  // Student ko kisne add kiya
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admins", required: true },

  // Student ki attendance records - array of objects
  attendance: [{
    date: Date,                                             // Attendance ka date
    status: { type: String, enum: ["Present", "Absent", "Leave"] }, // Present/Absent/Leave status
    remarks: String                                         // Koi special remarks (optional)
  }],

  // Student ko assigned homework ka reference
  homework: [{ type: mongoose.Schema.Types.ObjectId, ref: "homework" }],
  
  // Student ke exam results
  examResults: [{
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "exam" }, // Exam ka reference
    marks: Number,                                          // Kitne marks mile
    grade: String                                           // Grade (A, B, C, etc.)
  }],
  
  // Student ke leave requests ka reference
  leaveRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "leaverequest" }]
}, { timestamps: true }); // timestamps: true se createdAt aur updatedAt automatically add ho jayenge

// Pre-save middleware - ye function save karne se pehle chalega
studentSchema.pre("save", async function (next) {
  // Automatic email generation agar email provide nahi kiya gaya
  if (!this.email) {
    const nameClean = this.name.toLowerCase().replace(/[^a-z]/g, '');
    const lastnameClean = this.lastname.toLowerCase().replace(/[^a-z]/g, '');
    let baseEmail = `${nameClean}.${lastnameClean}`;
    let finalEmail = `${baseEmail}@college.edu`;
    let counter = 1;
    
    while (await mongoose.models.students.findOne({ email: finalEmail })) {
      finalEmail = `${baseEmail}${counter}@college.edu`;
      counter++;
    }
    this.email = finalEmail;
  }
  
  // Password hashing - agar password modify hua hai to hash karenge
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  next();
});

// Password verification method - login ke time password check karne ke liye
studentSchema.methods.matchPassword = async function (enteredPassword) {
  // User ka entered password aur database mein stored password ko compare karenge
  return await bcrypt.compare(enteredPassword, this.password);
};

// Student model create kar rahe hain aur export kar rahe hain
const Student = mongoose.model("students", studentSchema);
export default Student;