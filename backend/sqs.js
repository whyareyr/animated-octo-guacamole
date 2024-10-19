const {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");
const Data = require("./models/Data.js"); // Ensure this path is correct

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

const sendToSQS = async (id) => {
  const params = {
    MessageBody: JSON.stringify({ dataId: id }),
    QueueUrl: process.env.SQS_QUEUE_URL,
  };

  try {
    const command = new SendMessageCommand(params);
    await sqsClient.send(command);
    console.log("Message sent to SQS:", id);
  } catch (error) {
    console.error("Error sending to SQS:", error);
  }
};

// Function to process SQS messages
const processSQSMessage = async (message) => {
  const { MessageId, ReceiptHandle, Body } = message;
  const { dataId } = JSON.parse(Body);

  // Fetch data from MongoDB and update it
  const record = await Data.findById(dataId);
  if (record) {
    record.wordCount = record.description.split(" ").length;
    await record.save();

    console.log(`Processed message ${MessageId}: Updated word count`);
  }

  // Delete the message from the queue
  await sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      ReceiptHandle,
    })
  );
};

const processQueue = async () => {
  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL,
    MaxNumberOfMessages: 1,
  };

  try {
    const command = new ReceiveMessageCommand(params);
    const data = await sqsClient.send(command);
    if (data.Messages) {
      await processSQSMessage(data.Messages[0]);
    } else {
      console.log("No messages in the queue");
    }
  } catch (error) {
    console.error("Error processing queue:", error);
  }
};

module.exports = { sendToSQS, processQueue };
