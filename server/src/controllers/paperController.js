const { sequelize } = require("../config/db");
const { initModels } = require("../models");

const { Paper, Review, Conference, ConferenceReviewer } = initModels(sequelize);

function pickTwo(arr) {
  const unique = Array.from(new Set(arr));
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, 2);
}

async function submitPaper(req, res) {
  const { conferenceId, title, abstract, content, fileUrl } = req.body || {};
  if (!conferenceId || !title || !abstract || !content) {
    return res.status(400).json({ error: "conferenceId, title, abstract, content are required" });
  }

  const conf = await Conference.findByPk(Number(conferenceId));
  if (!conf) return res.status(404).json({ error: "Conference not found" });
  if (conf.status !== "OPEN") {
    return res.status(400).json({ error: "Conference is not open for submissions" });
  }

  const pool = await ConferenceReviewer.findAll({ where: { conferenceId: Number(conferenceId) } });
  const reviewerIds = pool.map((p) => p.reviewerId);

  if (reviewerIds.length < 2) {
    return res.status(400).json({ error: "Not enough reviewers in pool (need at least 2)" });
  }

  const chosen = pickTwo(reviewerIds);

  const paper = await Paper.create({
    conferenceId: Number(conferenceId),
    authorId: req.user.id,
    title: String(title).trim(),
    abstract: String(abstract).trim(),
    content: String(content).trim(),
    fileUrl: String(fileUrl || "").trim() || "https://example.com/mock-file",
    status: "UNDER_REVIEW",
    version: 1,
  });

  await Review.bulkCreate(
    chosen.map((rid) => ({
      paperId: paper.id,
      reviewerId: rid,
      status: "ASSIGNED",
    }))
  );

  res.status(201).json(paper);
}

async function allPapers(req, res) {
  const papers = await Paper.findAll({ order: [["id", "DESC"]] });
  res.json(papers);
}

async function myPapers(req, res) {
  const papers = await Paper.findAll({
    where: { authorId: req.user.id },
    include: [{ model: Review, as: "reviews" }],
    order: [["id", "DESC"]],
  });
  res.json(papers);
}

async function assignedPapers(req, res) {
  const reviews = await Review.findAll({
    where: { reviewerId: req.user.id },
    include: [{ model: Paper, as: "paper" }],
    order: [["id", "DESC"]],
  });

  res.json(reviews.map((r) => r.paper));
}

async function getPaper(req, res) {
  const id = Number(req.params.id);
  const paper = await Paper.findByPk(id, { include: [{ model: Review, as: "reviews" }] });
  if (!paper) return res.status(404).json({ error: "Paper not found" });
  res.json(paper);
}

async function uploadRevision(req, res) {
  const id = Number(req.params.id);
  const { content, fileUrl } = req.body || {};

  const cleanContent = String(content || "").trim();
  const cleanFileUrl = String(fileUrl || "").trim();

  if (!cleanContent && !cleanFileUrl) {
    return res.status(400).json({ error: "content or fileUrl is required" });
  }

  const paper = await Paper.findByPk(id);
  if (!paper) return res.status(404).json({ error: "Paper not found" });
  if (paper.authorId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  if (cleanContent) paper.content = cleanContent;
  if (cleanFileUrl) paper.fileUrl = cleanFileUrl;

  paper.version = paper.version + 1;
  paper.status = "UNDER_REVIEW";
  await paper.save();

  await Review.update(
    { status: "ASSIGNED", score: null, comments: null, recommendation: null, submittedAt: null },
    { where: { paperId: paper.id } }
  );

  res.json(paper);
}

async function submitReview(req, res) {
  const paperId = Number(req.params.id);
  const { score, comments, recommendation } = req.body || {};
  if (recommendation !== "ACCEPT" && recommendation !== "REJECT" && recommendation !== "REVISION") {
    return res.status(400).json({ error: "recommendation must be ACCEPT/REJECT/REVISION" });
  }

  const review = await Review.findOne({ where: { paperId, reviewerId: req.user.id } });
  if (!review) return res.status(403).json({ error: "You are not assigned to this paper" });

  review.score = score ?? null;
  review.comments = comments ?? null;
  review.recommendation = recommendation;
  review.status = "SUBMITTED";
  review.submittedAt = new Date();
  await review.save();

  const all = await Review.findAll({ where: { paperId } });
  const done = all.filter((r) => r.status === "SUBMITTED");

  if (done.length === all.length) {
    const paper = await Paper.findByPk(paperId);

    const recs = all.map((r) => r.recommendation);
    if (recs.includes("REJECT")) paper.status = "REJECTED";
    else if (recs.includes("REVISION")) paper.status = "REVISION_REQUIRED";
    else paper.status = "ACCEPTED";

    await paper.save();
  }

  res.json({ ok: true });
}

module.exports = {
  submitPaper,
  myPapers,
  assignedPapers,
  getPaper,
  uploadRevision,
  submitReview,
  allPapers,
};
