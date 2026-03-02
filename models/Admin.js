// Mongoose library import kar rahe hain - MongoDB ke saath kaam karne ke liye
import mongoose from "mongoose";
// bcrypt library import kar rahe hain - password ko encrypt karne ke liye
import bcrypt from "bcryptjs";

// Admin ka database schema define kar rahe hain
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },                    // Admin ka naam (required field)
  email: { type: String, required: true, unique: true },     // Email address (unique hona chahiye)
  password: { type: String, required: true },                // Login password (encrypted form mein store hoga)
  domain: { type: String, required: true },                  // Admin ka domain/department (e.g., "IT", "HR")
  role: { type: String, enum: ["Admin"], default: "Admin" }, // Role sirf "Admin" ho sakta hai
}, { timestamps: true }); // createdAt aur updatedAt automatically add ho jayenge

// Password hashing middleware - password ko save karne se pehle encrypt kar denge
adminSchema.pre("save", async function (next) {
  // Agar password modify nahi hua hai to skip kar denge
  if (!this.isModified("password")) return next();
  
  // Salt generate kar rahe hain - ye password ko aur secure banata hai
  const salt = await bcrypt.genSalt(10);
  
  // Password ko salt ke saath hash kar rahe hain
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password verification method - login ke time password check karne ke liye
adminSchema.methods.matchPassword = async function (enteredPassword) {
  // User ka entered password aur database mein stored password ko compare karenge
  return await bcrypt.compare(enteredPassword, this.password);
}

// Admin model create kar rahe hain aur export kar rahe hain
const Admin = mongoose.model("admins", adminSchema, "admins");
export default Admin;
