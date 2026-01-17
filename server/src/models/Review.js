const { DataTypes } = require("sequelize");

function ReviewModel(sequelize) {
  return sequelize.define(
    "Review",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      status: { type: DataTypes.ENUM("ASSIGNED", "SUBMITTED"), allowNull: false, defaultValue: "ASSIGNED" },
      score: { type: DataTypes.INTEGER, allowNull: true },
      comments: { type: DataTypes.TEXT, allowNull: true },
      recommendation: { type: DataTypes.ENUM("ACCEPT", "REJECT", "REVISION"), allowNull: true },
      submittedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "reviews", underscored: true }
  );
}

module.exports = ReviewModel;
