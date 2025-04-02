const Course = (sequelize, DataTypes) => {
    const CourseModel = sequelize.define("Course", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.INTEGER, // in minutes
        defaultValue: 0,
      },
      level: {
        type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
        defaultValue: "beginner",
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    })
  
    CourseModel.associate = (models) => {
      CourseModel.belongsTo(models.User, {
        foreignKey: "mentorId",
        as: "mentor",
      })
      CourseModel.belongsTo(models.CourseCategory, {
        foreignKey: "categoryId",
        as: "category",
      })
      CourseModel.belongsToMany(models.User, {
        through: models.Enrollment,
        foreignKey: "courseId",
        as: "students",
      })
    }
  
    return CourseModel
  }
  
  export default Course
  
  