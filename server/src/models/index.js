const UserModel = require("./User");
const ConferenceModel = require("./Conference");
const ConferenceReviewerModel = require("./ConferenceReviewer");
const PaperModel = require("./Paper");
const ReviewModel = require("./Review");

let models;

function initModels(sequelize) {
  if (models) return models;

  const User = UserModel(sequelize);
  const Conference = ConferenceModel(sequelize);
  const ConferenceReviewer = ConferenceReviewerModel(sequelize);
  const Paper = PaperModel(sequelize);
  const Review = ReviewModel(sequelize);

  Conference.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

  Conference.belongsToMany(User, {
    through: ConferenceReviewer,
    as: "reviewers",
    foreignKey: "conferenceId",
    otherKey: "reviewerId",
  });

  User.belongsToMany(Conference, {
    through: ConferenceReviewer,
    as: "reviewerPools",
    foreignKey: "reviewerId",
    otherKey: "conferenceId",
  });

  Paper.belongsTo(Conference, {
    as: "conference",
    foreignKey: { name: "conferenceId", allowNull: false },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Conference.hasMany(ConferenceReviewer, { as: "reviewerPool", foreignKey: "conferenceId" });
  ConferenceReviewer.belongsTo(Conference, { foreignKey: "conferenceId" });

  Paper.belongsTo(User, { as: "author", foreignKey: "authorId" });
  Paper.hasMany(Review, { as: "reviews", foreignKey: "paperId" });

  Review.belongsTo(Paper, { as: "paper", foreignKey: "paperId" });
  Review.belongsTo(User, { as: "reviewer", foreignKey: "reviewerId" });

  User.hasMany(ConferenceReviewer, { as: "poolEntries", foreignKey: "reviewerId" });
  ConferenceReviewer.belongsTo(User, { as: "reviewer", foreignKey: "reviewerId" });

  models = { User, Conference, ConferenceReviewer, Paper, Review };
  return models;
}

module.exports = { initModels };
