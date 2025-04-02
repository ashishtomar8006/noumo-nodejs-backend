module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("Courses", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
        },
        thumbnail: {
          type: Sequelize.STRING,
        },
        duration: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        level: {
          type: Sequelize.ENUM("beginner", "intermediate", "advanced"),
          defaultValue: "beginner",
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          defaultValue: 0.0,
        },
        isPublished: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        mentorId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        categoryId: {
          type: Sequelize.INTEGER,
          references: {
            model: "CourseCategories",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
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
      await queryInterface.dropTable("Courses")
    },
  }
  
  