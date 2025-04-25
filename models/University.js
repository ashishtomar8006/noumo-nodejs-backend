// models/University.js
const University = (sequelize, DataTypes) => {
    const University = sequelize.define("University", {
      universityUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      industry: {
        type: DataTypes.JSON,
        allowNull: true
      },
      company_size: {
        type: DataTypes.STRING,
      },
      university_name: {
        type: DataTypes.STRING,
      },
      universityType: {
        type: DataTypes.STRING,
      },
      jobTitle: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      faculty: {
        type: DataTypes.STRING,
      },
      yearOfStudy: {
        type: DataTypes.STRING,
      },
    });
  
    University.associate = (models) => {
      University.belongsTo(models.User, {
        foreignKey: "universityUserId",
        as: "user",
      });
    };
  
    return University;
  };
  export default University