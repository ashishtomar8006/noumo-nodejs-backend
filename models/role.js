const Role = (sequelize, DataTypes) => {
    const RoleModel = sequelize.define("Role", {
      name: DataTypes.STRING,
    })
  
    RoleModel.associate = (models) => {
      RoleModel.belongsToMany(models.User, {
        through: "UserRoles",
        foreignKey: "roleId",
      })
    }
  
    return RoleModel
  }
  
  export default Role // ✅ Change from `module.exports =` to `export default`
  
  