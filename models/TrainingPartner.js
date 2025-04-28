// models/TrainingPartner.js
const TrainingPartner = (sequelize, DataTypes) => {
    const TrainingPartner = sequelize.define("TrainingPartner", {
      trainingPartnerUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Make sure this matches your Users table name exactly
          key: 'id',
        },
        onDelete: 'CASCADE',
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
        onDelete: "CASCADE",
      });
    };
  
    return TrainingPartner;
  };
  export default TrainingPartner