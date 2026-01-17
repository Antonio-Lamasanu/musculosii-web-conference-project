const { sequelize } = require("../config/db");
const { initModels } = require("../models");
const { gravatarUrl } = require("../utils/gravatar");

const { User } = initModels(sequelize);

async function login(req, res) {
  const { email, name, role } = req.body || {};
  if (!email) return res.status(400).json({ error: "email is required" });

  let user = await User.findOne({ where: { email } });

  if (!user) {
    if (!name || !role) {
      return res.status(400).json({ error: "name and role are required for first login" });
    }

    const allowed = ["AUTHOR", "REVIEWER", "ORGANIZER"];
    if (!allowed.includes(role)) {
      return res.status(400).json({ error: "role must be AUTHOR/REVIEWER/ORGANIZER" });
    }

    user = await User.create({
      name,
      email,
      role,
      avatarUrl: gravatarUrl(email),
    });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  });
}

async function me(req, res) {
  const u = req.user;
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role, avatarUrl: u.avatarUrl });
}

module.exports = { login, me };
