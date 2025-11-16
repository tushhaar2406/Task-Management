import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProjectMember = sequelize.define("ProjectMember", {
  pm_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_in_project: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

export default ProjectMember;
