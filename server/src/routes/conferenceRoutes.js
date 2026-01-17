const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  createConference,
  listConferences,
  addReviewerToPool,
  listReviewerPool,
  closeConference,
  deleteConference,
} = require("../controllers/conferenceController");

const router = express.Router();

router.get("/", requireAuth, listConferences);
router.post("/", requireAuth, requireRole(["ORGANIZER"]), createConference);

router.post("/:id/reviewers", requireAuth, requireRole(["ORGANIZER"]), addReviewerToPool);
router.get("/:id/reviewers", requireAuth, requireRole(["ORGANIZER"]), listReviewerPool);

router.patch("/:id/close", requireAuth, requireRole(["ORGANIZER"]), closeConference);
router.delete("/:id", requireAuth, requireRole(["ORGANIZER"]), deleteConference);

module.exports = router;
