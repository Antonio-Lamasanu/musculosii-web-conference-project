const { sequelize } = require("../config/db");
const { initModels } = require("../models");

const { User } = initModels(sequelize);

async function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Missing x-user-id" });

  const user = await User.findByPk(userId);
  if (!user) return res.status(401).json({ error: "Invalid user" });

  req.user = user;
  next();
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

module.exports = { requireAuth, requireRole };
