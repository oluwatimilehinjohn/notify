// producer.js
const { Kafka } = require("kafkajs");
const UserSignupSchema = require("./schemas/userSignup.schema");

const kafka = new Kafka({
  clientId: "notify-app",
  brokers: ["localhost:9092"], // PLAINTEXT local Kafka
});

const producer = kafka.producer();

async function initProducer() {
  await producer.connect();
  console.log("Kafka Producer connected");
}
initProducer();

async function sendSignupEvent(user) {
  const validatedUser = UserSignupSchema.parse({
    ...user,
    createdAt: new Date().toISOString(),
  });

  await producer.send({
    topic: "user-signup",
    messages: [{ value: JSON.stringify(validatedUser) }],
  });
}

process.on("exit", async () => {
  await producer.disconnect();
});

module.exports = sendSignupEvent;
