const { DataTypes } = require("sequelize");

function PaperModel(sequelize) {
  return sequelize.define(
    "Paper",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      conferenceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      authorId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

      title: { type: DataTypes.STRING(200), allowNull: false },
      abstract: { type: DataTypes.TEXT, allowNull: false },

      content: { type: DataTypes.TEXT, allowNull: false },

      fileUrl: { type: DataTypes.STRING(600), allowNull: false },
      version: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
      status: {
        type: DataTypes.ENUM("SUBMITTED", "UNDER_REVIEW", "REVISION_REQUIRED", "RESUBMITTED", "ACCEPTED", "REJECTED"),
        allowNull: false,
        defaultValue: "SUBMITTED",
      },
    },
    { tableName: "papers", underscored: true }
  );
}

module.exports = PaperModel;
