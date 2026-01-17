const { DataTypes } = require("sequelize");

function ConferenceReviewerModel(sequelize) {
  return sequelize.define(
    "ConferenceReviewer",
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      conferenceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      reviewerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    { tableName: "conference_reviewers", underscored: true }
  );
}

module.exports = ConferenceReviewerModel;
