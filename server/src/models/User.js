const { DataTypes } = require("sequelize");

function UserModel(sequelize) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(190),
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM("AUTHOR", "REVIEWER", "ORGANIZER"),
        allowNull: false,
      },
      avatarUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: "users",
      underscored: true,
    }
  );

  return User;
}

module.exports = UserModel;
