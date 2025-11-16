import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import "./models/index.js"; // Loads models and associations
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Base API routes
app.use("/api/users", userRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Task Management API running successfully!");
});

// Sync DB and start server
sequelize
  .sync({ alter: true }) // use { force: true } for full DB reset in dev
  .then(() => {
    console.log("Database synced successfully!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(` Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error(" Database connection failed:", err));
