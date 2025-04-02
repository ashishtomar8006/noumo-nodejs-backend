const Enrollment = (sequelize, DataTypes) => {
    const EnrollmentModel = sequelize.define("Enrollment", {
      enrollmentDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      completionDate: {
        type: DataTypes.DATE,
      },
      progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("enrolled", "in-progress", "completed", "dropped"),
        defaultValue: "enrolled",
      },
    })
  
    return EnrollmentModel
  }
  
  export default Enrollment
  
  