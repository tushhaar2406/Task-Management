import express from "express";
import {
  registerUser,
  loginUser,
  getAllEmployees,
  assignReportingManager,
  updateTechStack,
  deleteUser,
} from "../controllers/userController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";


const router = express.Router();

// ===============================
// PUBLIC ROUTES
// ===============================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ===============================
// PROTECTED ROUTES (Logged-in users only)
// ===============================
router.get("/employees", authMiddleware, getAllEmployees);

// ===============================
// ADMIN ONLY ROUTES
// ===============================
router.put(
  "/assign-manager",
  authMiddleware,
  adminMiddleware,     // ⭐ ensures only admins can call this
  assignReportingManager
);

router.put("/update-techstack", authMiddleware, updateTechStack);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,     // ⭐ ensures only admins can call this
  deleteUser
);

export default router;
