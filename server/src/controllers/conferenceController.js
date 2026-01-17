const { initModels } = require("../models");
const { sequelize } = require("../config/db");

const { Conference, ConferenceReviewer, Paper, Review, User } = initModels(sequelize);

async function createConference(req, res) {
  const { title, description, startDate, endDate } = req.body || {};
  if (!title || !startDate || !endDate) {
    return res.status(400).json({ error: "title, startDate, endDate are required" });
  }

  const conf = await Conference.create({
    title,
    description: description || null,
    startDate,
    endDate,
    createdBy: req.user.id,
    status: "OPEN",
  });

  res.status(201).json(conf);
}

async function listConferences(req, res) {
  const conferences = await Conference.findAll({ order: [["id", "DESC"]] });
  res.json(conferences);
}

async function addReviewerToPool(req, res) {
  try {
    const conferenceId = Number(req.params.id);
    const { reviewerId } = req.body || {};

    if (!reviewerId) return res.status(400).json({ error: "reviewerId is required" });

    const conf = await Conference.findByPk(conferenceId);
    if (!conf) return res.status(404).json({ error: "Conference not found" });

    const reviewer = await User.findByPk(Number(reviewerId));
    if (!reviewer || String(reviewer.role).toUpperCase() !== "REVIEWER") {
      return res.status(400).json({ error: "User is not a reviewer" });
    }

    const exists = await ConferenceReviewer.findOne({
      where: { conferenceId, reviewerId: reviewer.id },
    });
    if (exists) return res.status(400).json({ error: "Reviewer already in pool" });

    const entry = await ConferenceReviewer.create({
      conferenceId,
      reviewerId: reviewer.id,
    });

    return res.status(201).json(entry);
  } catch (e) {
    console.error("addReviewerToPool failed:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function listReviewerPool(req, res) {
  try {
    const conferenceId = Number(req.params.id);
    const pool = await ConferenceReviewer.findAll({ where: { conferenceId } });
    return res.json(pool);
  } catch (e) {
    console.error("listReviewerPool failed:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function closeConference(req, res) {
  const id = Number(req.params.id);
  const conf = await Conference.findByPk(id);
  if (!conf) return res.status(404).json({ error: "Conference not found" });

  conf.status = "CLOSED";
  await conf.save();

  res.json(conf);
}

async function deleteConference(req, res) {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid conference id" });

  const conf = await Conference.findByPk(id);
  if (!conf) return res.status(404).json({ error: "Conference not found" });

  try {
    await sequelize.transaction(async (t) => {
      const papers = await Paper.findAll({
        where: { conferenceId: id },
        attributes: ["id"],
        transaction: t,
      });

      const paperIds = papers.map((p) => p.id);

      if (paperIds.length > 0) {
        await Review.destroy({ where: { paperId: paperIds }, transaction: t });
        await Paper.destroy({ where: { id: paperIds }, transaction: t });
      }

      await ConferenceReviewer.destroy({ where: { conferenceId: id }, transaction: t });
      await Conference.destroy({ where: { id }, transaction: t });
    });

    return res.json({ ok: true });
  } catch (e) {
    console.error("deleteConference failed:", e);
    return res.status(500).json({ error: "Failed to delete conference" });
  }
}

module.exports = {
  createConference,
  listConferences,
  addReviewerToPool,
  listReviewerPool,
  closeConference,
  deleteConference,
};
