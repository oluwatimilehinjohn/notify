// producer.js
const { Kafka, Partitioners } = require("kafkajs");
const crypto = require("crypto");
const UserSignupSchema = require("./schemas/userSignup.schema");

// Kafka connection (plaintext, local dev)
const kafka = new Kafka({
  clientId: "notify-app",
  brokers: ["localhost:9092"], // matches docker-compose
  createPartitioner: Partitioners.LegacyPartitioner, // avoid v2 warnings
});

const producer = kafka.producer();

async function sendSignupEvent(user) {
  //  validate before sending
  const validatedUser = UserSignupSchema.parse({
    ...user,
    createdAt: new Date().toISOString(),
  });

  await producer.connect();
  await producer.send({
    topic: "user-signup",
    messages: [{ value: JSON.stringify(validatedUser) }],
  });
  await producer.disconnect();

  
}



module.exports = sendSignupEvent;
