const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { processQueue } = require("./sqs.js"); // Import the processQueue function

const mongoose = require("mongoose");
require("dotenv").config();
const apiRoutes = require("./routes/api");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", apiRoutes);

const startCronJob = () => {
  console.log("Starting cron job...");

  // Run cron job every minute
  cron.schedule("* * * * *", async () => {
    console.log("Cron job running...");
    await processQueue(); // Call the processQueue function
  });
};

startCronJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
