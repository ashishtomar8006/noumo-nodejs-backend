import { sequelize } from "../config/database.js"
import { DataTypes } from "sequelize"

// Import models
import User from "./user.js"
import Role from "./role.js"
import Course from "./course.js"
import CourseCategory from "./courseCategory.js"
import Enrollment from "./enrollment.js"

// Initialize models
const db = {}
db.User = User(sequelize, DataTypes)
db.Role = Role(sequelize, DataTypes)
db.Course = Course(sequelize, DataTypes)
db.CourseCategory = CourseCategory(sequelize, DataTypes)
db.Enrollment = Enrollment(sequelize, DataTypes)

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

export default db

