module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("UserRoles", {
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
        roleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Roles",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
  
      // Add a unique constraint to prevent duplicate user-role assignments
      await queryInterface.addConstraint("UserRoles", {
        fields: ["userId", "roleId"],
        type: "unique",
        name: "unique_user_role",
      })
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("UserRoles")
    },
  }
  
  