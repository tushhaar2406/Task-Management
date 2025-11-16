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

//user register route
router.post("/register", registerUser);

//user login route
router.post("/login", loginUser);

//get all employees route
router.get("/employees", authMiddleware, getAllEmployees);

// assign reporting manager to an employee
router.put(
  "/assign-manager",
  authMiddleware,
  adminMiddleware,     
  assignReportingManager
);

// update tech stack for logged-in user
router.put("/update-techstack", authMiddleware, updateTechStack);

// delete user (admin only)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,    
  deleteUser
);

export default router;
