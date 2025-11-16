import User from "./users.js";
import Project from "./projects.js";
import Task from "./tasks.js";
import Comment from "./comments.js";
import Notification from "./notification.js";
import ProjectMember from "./projectMember.js";



User.hasMany(Project, { foreignKey: "created_by" });
Project.belongsTo(User, { as: "creator", foreignKey: "created_by" });


// ===============================
// User → Task
// ===============================
User.hasMany(Task, { foreignKey: "assigned_to" });
Task.belongsTo(User, { as: "assignee", foreignKey: "assigned_to" });


// ===============================
// Project → Task
// ===============================
Project.hasMany(Task, { foreignKey: "project_id" });
Task.belongsTo(Project, { foreignKey: "project_id" });


// ===============================
// Task → Comment
// ===============================
Task.hasMany(Comment, { foreignKey: "task_id" });
Comment.belongsTo(Task, { foreignKey: "task_id" });


// ===============================
// User → Comment
// ===============================
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });


// ===============================
// User → Notification
// ===============================
User.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(User, { foreignKey: "user_id" });


// ===============================
// Project ↔ Many Users (Project Members)
// ===============================
Project.belongsToMany(User, { through: ProjectMember, foreignKey: "project_id" });
User.belongsToMany(Project, { through: ProjectMember, foreignKey: "user_id" });


// ===============================
// User → Reporting Manager (self reference)
// ===============================
User.belongsTo(User, {
  as: "manager",
  foreignKey: "reporting_manager_id",  // IMPORTANT! match your model
});

User.hasMany(User, {
  as: "teamMembers",
  foreignKey: "reporting_manager_id",
});


export {
  User,
  Project,
  Task,
  Comment,
  Notification,
  ProjectMember,
};
