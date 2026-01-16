const md5 = require("md5");

function gravatarUrl(email, size = 120) {
  const normalized = String(email || "").trim().toLowerCase();
  const hash = md5(normalized);
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

module.exports = { gravatarUrl };
