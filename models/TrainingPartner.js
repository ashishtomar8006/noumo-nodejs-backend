// models/TrainingPartner.js
const TrainingPartner = (sequelize, DataTypes) => {
    const TrainingPartner = sequelize.define("TrainingPartner", {
      trainingPartnerUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
      },
      industry: {
        type: DataTypes.STRING,
      },
      expertise: {
        type: DataTypes.JSON,
      },
      format: {
        type: DataTypes.JSON,
      },
      location: {
        type: DataTypes.STRING,
      },
      jobTitle: {
        type: DataTypes.STRING,
      },
    });
  
    TrainingPartner.associate = (models) => {
      TrainingPartner.belongsTo(models.User, {
        foreignKey: "trainingPartnerUserId",
        as: "user",
      });
    };
  
    return TrainingPartner;
  };
  export default TrainingPartner