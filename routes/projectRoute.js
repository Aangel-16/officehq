const express = require("express");
const router = express.Router();

// Sample route
router.get("/", (req, res) => {
  res.send("Project home route working!");
});

module.exports = router;
