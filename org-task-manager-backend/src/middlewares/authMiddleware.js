import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  Check Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing or malformed",
      });
    }

    //  Extract token
    const token = authHeader.split(" ")[1];

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Save user info to request object
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
