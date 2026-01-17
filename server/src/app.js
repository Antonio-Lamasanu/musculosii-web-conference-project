const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conferenceRoutes = require("./routes/conferenceRoutes");
const paperRoutes = require("./routes/paperRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "conference-api" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/conferences", conferenceRoutes);
app.use("/papers", paperRoutes);

module.exports = app;
