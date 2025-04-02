module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("Users", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        firstName: {
          type: Sequelize.STRING,
        },
        lastName: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        employer: {
          type: Sequelize.STRING,
        },
        industry: {
          type: Sequelize.STRING,
        },
        experienceLevel: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        mentoringGoals: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        profilePicture: {
          type: Sequelize.STRING,
        },
        bio: {
          type: Sequelize.TEXT,
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
        },
      })
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("Users")
    },
  }
  
  