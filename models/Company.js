// models/Company.js
const Company = (sequelize, DataTypes) => {
    const Company = sequelize.define("Company", {
      companyUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      industry: {
        type: DataTypes.STRING,
      },
      company_size: {
        type: DataTypes.STRING,
      },
      company_name: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      jobTitle: {
        type: DataTypes.STRING,
      },
    });
  
    Company.associate = (models) => {
      Company.belongsTo(models.User, {
        foreignKey: "companyUserId",
        as: "user",
      });
    };
  
    return Company;
  };
  export default Company