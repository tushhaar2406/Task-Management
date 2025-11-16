import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing or malformed",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Save user info to request object
    req.user = decoded; 
    // decoded contains: { id, name, email, role, iat, exp }

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
