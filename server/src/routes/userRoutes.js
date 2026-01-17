const express = require("express");
const { sequelize } = require("../config/db");
const { initModels } = require("../models");
const { requireAuth } = require("../middleware/auth");

const { User } = initModels(sequelize);

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const role = req.query.role;
  const where = role ? { role } : undefined;
  const users = await User.findAll({
    where,
    attributes: ["id", "name", "email", "role", "avatarUrl"],
  });
  res.json(users);
});

module.exports = router;
