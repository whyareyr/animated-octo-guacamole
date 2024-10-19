const express = require("express");
const router = express.Router();
const Data = require("../models/Data.js");
const { sendToSQS } = require("../sqs.js");

// Generate new data
router.post("/generate", async (req, res) => {
  const { title, description } = req.body;
  try {
    const data = new Data({ title, description, timestamp: new Date() });
    await data.save();

    // Send task to AWS SQS
    await sendToSQS(data._id);

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Error generating data" });
  }
});

// Fetch all data
router.get("/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

module.exports = router;
