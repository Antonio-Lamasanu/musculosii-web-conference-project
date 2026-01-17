const { DataTypes } = require("sequelize");

function ConferenceModel(sequelize) {
  return sequelize.define(
    "Conference",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING(160), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      endDate: { type: DataTypes.DATEONLY, allowNull: false },
      status: {
        type: DataTypes.ENUM("DRAFT", "OPEN", "CLOSED"),
        allowNull: false,
        defaultValue: "OPEN",
      },
      createdBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    { tableName: "conferences", underscored: true }
  );
}

module.exports = ConferenceModel;
