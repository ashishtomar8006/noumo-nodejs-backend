const User = (sequelize, DataTypes) => {
    const UserModel = sequelize.define("User", {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      surname: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
      },
      universityName: {
        type: DataTypes.STRING,
      },
      phone:{
        type:DataTypes.STRING,
      },
      companyName: {
        type: DataTypes.STRING,
      },      
      yearOfStudy: {
        type: DataTypes.INTEGER,
      },
      faculty:{
        type:DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: { // Correctly renamed from 'role' to 'roleId'
        type: DataTypes.INTEGER,
        references: {
          model: "Roles", // Ensure this matches your table name
          key: "id",
        },
      },
      employer:{
        type:DataTypes.STRING
      },
      experienceLevel: {
        type: DataTypes.STRING,
      },
      eductionLevel: {
        type: DataTypes.STRING,
      },      
      mentoringGoals: {
        type: DataTypes.STRING,
      },
      industry:{
        type:DataTypes.STRING
      },
      profilePicture: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    })
  
    UserModel.associate = (models) => {
      UserModel.hasMany(models.Course, {
        foreignKey: "mentorId",
        as: "createdCourses",
      })
      UserModel.belongsToMany(models.Course, {
        through: models.Enrollment,
        foreignKey: "userId",
        as: "enrolledCourses",
      })
      UserModel.belongsTo(models.Role, { foreignKey: "roleId", as: "role" }),
      UserModel.hasOne(models.Company, {
        foreignKey: "companyUserId",
        as: "company",
        onDelete: "CASCADE",
        hooks: true,
      }); 
      UserModel.hasOne(models.University, {
        foreignKey: "universityUserId",
        as: "University",
        onDelete: "CASCADE",
        hooks: true,
      }); 

      UserModel.hasOne(models.TrainingPartner, {
        foreignKey: "trainingPartnerUserId",
        as: "trainingpartner",
        onDelete: "CASCADE",
        hooks: true,
      });
      

      UserModel.hasOne(models.CompanyRequest, {
        foreignKey: "email",
        sourceKey: "email",
        as: "companyRequest",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  
    return UserModel
  }
  
  export default User
  
  