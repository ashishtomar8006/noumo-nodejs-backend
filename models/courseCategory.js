const CourseCategory = (sequelize, DataTypes) => {
    const CourseCategoryModel = sequelize.define("CourseCategory", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      icon: {
        type: DataTypes.STRING,
      },
    })
  
    CourseCategoryModel.associate = (models) => {
      CourseCategoryModel.hasMany(models.Course, {
        foreignKey: "categoryId",
        as: "courses",
      })
    }
  
    return CourseCategoryModel
  }
  
  export default CourseCategory
  
  