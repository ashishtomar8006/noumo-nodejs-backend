import { sequelize } from "../config/database.js"
import { DataTypes } from "sequelize"

// Import models
import User from "./user.js"
import Role from "./role.js"
import Course from "./course.js"
import CourseCategory from "./courseCategory.js"
import Enrollment from "./enrollment.js"
import CompanyRequest from "./companyRequest.js"
import ContactUs from "./contactUsModal.js"
import Company from "./Company.js"
import University from "./University.js"
import TrainingPartner from "./TrainingPartner.js"

// Initialize models
const db = {}
db.User = User(sequelize, DataTypes)
db.Role = Role(sequelize, DataTypes)
db.Course = Course(sequelize, DataTypes)
db.CourseCategory = CourseCategory(sequelize, DataTypes)
db.Enrollment = Enrollment(sequelize, DataTypes)
db.CompanyRequest = CompanyRequest(sequelize, DataTypes)
db.ContactUs = ContactUs(sequelize, DataTypes)
db.Company = Company(sequelize, DataTypes)
db.University = University(sequelize, DataTypes)
db.TrainingPartner = TrainingPartner(sequelize, DataTypes)


// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

export default db

