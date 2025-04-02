module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("Enrollments", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        courseId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Courses",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        enrollmentDate: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        completionDate: {
          type: Sequelize.DATE,
        },
        progress: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.ENUM("enrolled", "in-progress", "completed", "dropped"),
          defaultValue: "enrolled",
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
  
      // Add a unique constraint to prevent duplicate enrollments
      await queryInterface.addConstraint("Enrollments", {
        fields: ["userId", "courseId"],
        type: "unique",
        name: "unique_user_course",
      })
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("Enrollments")
    },
  }
  
  