import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Task = sequelize.define("Task", {
  task_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  task_description: {
    type: DataTypes.TEXT,
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "medium",
  },
  status: {
    type: DataTypes.ENUM("to_do", "in_progress", "done"),
    defaultValue: "to_do",
  },
  due_date: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

export default Task;
