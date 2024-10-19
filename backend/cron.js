const cron = require("node-cron");
const { processQueue } = require("./sqs.js"); // Import the processQueue function
require("dotenv").config();

const startCronJob = () => {
  console.log("Starting cron job...");

  // Run cron job every minute
  cron.schedule("* * * * *", async () => {
    console.log("Cron job running...");
    await processQueue(); // Call the processQueue function
  });
};

startCronJob();
