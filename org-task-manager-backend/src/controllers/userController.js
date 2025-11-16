import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { User } from "../models/index.js";

dotenv.config();

// =====================================
// Utility: Generate JWT Token
// =====================================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// =====================================
// REGISTER USER
// =====================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, tech_stack, role } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: "Name, email, password, and department are required",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      tech_stack,
      role: role || "employee",
      reporting_manager_id: null,
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role,
        tech_stack: newUser.tech_stack,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =====================================
// LOGIN USER
// =====================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        tech_stack: user.tech_stack,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =====================================
// GET ALL USERS (with reporting manager name)
// =====================================
export const getAllEmployees = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "user_id",
        "name",
        "email",
        "role",
        "department",
        "tech_stack",
        "reporting_manager_id",
        "createdAt",

        // ⭐ Fetch reporting manager name using self join
        [Sequelize.col("manager.name"), "reporting_manager"],
      ],

      include: [
        {
          model: User,
          as: "manager",
          attributes: [], // No nested manager object
        },
      ],

      raw: true,
    });

    res.status(200).json({
      message: "Employee list fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =====================================
// ASSIGN REPORTING MANAGER (ADMIN ONLY)
// =====================================
export const assignReportingManager = async (req, res) => {
  try {
    const adminUser = req.user; // From middleware
    const { userId, managerId } = req.body;

    // Only admin allowed
    if (adminUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admin users can assign reporting managers",
      });
    }

    // Check user exists
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Check manager exists
    const manager = await User.findByPk(managerId);
    if (!manager)
      return res.status(404).json({ message: "Manager not found" });

    // Assign manager
    user.reporting_manager_id = managerId;
    await user.save();

    res.status(200).json({
      message: "Reporting manager assigned successfully",
      user,
    });
  } catch (error) {
    console.error("Assign Manager Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update tech stack

export const updateTechStack = async (req, res) => {
  try {
    const userId = req.user.id;   // from JWT
    const { tech_stack } = req.body;

    if (!Array.isArray(tech_stack)) {
      return res.status(400).json({ message: "tech_stack must be an array" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.tech_stack = tech_stack;
    await user.save();

    res.status(200).json({
      message: "Tech stack updated successfully",
      tech_stack: user.tech_stack
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE USER (ADMIN ONLY)
export const deleteUser = async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    const loggedInUser = req.user; // { user_id, role, email, ... }

    // 1️⃣ Check if logged-in user is admin
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete users" });
    }

    // 2️⃣ Prevent admin from deleting themselves (optional but smart)
    if (parseInt(userIdToDelete) === loggedInUser.user_id) {
      return res.status(400).json({
        message: "Admin cannot delete their own account",
      });
    }

    // 3️⃣ Find the user
    const user = await User.findByPk(userIdToDelete);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 4️⃣ Delete user
    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
