const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  submitPaper,
  myPapers,
  assignedPapers,
  getPaper,
  uploadRevision,
  submitReview,
  allPapers,
} = require("../controllers/paperController");

const router = express.Router();

router.get("/all", requireAuth, requireRole(["ORGANIZER"]), allPapers);

router.post("/", requireAuth, requireRole(["AUTHOR"]), submitPaper);
router.get("/mine", requireAuth, requireRole(["AUTHOR"]), myPapers);
router.get("/assigned", requireAuth, requireRole(["REVIEWER"]), assignedPapers);

router.get("/:id", requireAuth, getPaper);
router.patch("/:id/revision", requireAuth, requireRole(["AUTHOR"]), uploadRevision);
router.post("/:id/reviews", requireAuth, requireRole(["REVIEWER"]), submitReview);

module.exports = router;
