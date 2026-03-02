// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },                        // id + role token me
    process.env.JWT_SECRET || "supersecretkey123",
    { expiresIn: "1h" }
  );
};

export default generateToken;
