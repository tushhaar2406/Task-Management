import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Project = sequelize.define("Project", {
  project_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  project_description: {
    type: DataTypes.TEXT,
  },
  start_date: {
    type: DataTypes.DATE,
  },
  end_date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM("not_started", "in_progress", "completed"),
    defaultValue: "not_started",
  },
}, {
  timestamps: true,
});

export default Project;
