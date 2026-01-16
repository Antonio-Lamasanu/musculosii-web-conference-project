const UserModel = require("./User");

function initModels(sequelize) {
  const User = UserModel(sequelize);
  return { User };
}

module.exports = { initModels };
