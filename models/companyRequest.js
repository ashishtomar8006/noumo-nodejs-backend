// models/Contact.js
const CompanyRequest = (sequelize, DataTypes) => {
    const CompanyRequest = sequelize.define("CompanyRequest", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      job_title: {
        type: DataTypes.STRING(100)
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: DataTypes.STRING(20)
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }, 
      company_name: {
        type: DataTypes.STRING(150)
      },
      industry: {
        type: DataTypes.STRING(100)
      },
      company_size: {
        type: DataTypes.STRING(50)
      },
      location: {
        type: DataTypes.STRING(100)
      },
    }, {
      tableName: "CompanyRequest"
    });
  
    CompanyRequest.associate = (models) => {
      CompanyRequest.belongsTo(models.User, {
        foreignKey: "email",
        targetKey: "email",
        as: "user",
        onDelete: "CASCADE",  // <-- this is the key line
      });
    };
    
    
    return CompanyRequest;
  };

  export default CompanyRequest;
  