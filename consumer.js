// consumer.js
const { Kafka } = require("kafkajs");
const prisma = require("./db");

// Kafka connection (plaintext, local dev)
const kafka = new Kafka({
  clientId: "notify-app",
  brokers: ["localhost:9092"], // matches docker-compose
});

const consumer = kafka.consumer({ groupId: "notification-group" });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-signup", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const user = JSON.parse(message.value.toString());

        // ✅ save user data to DB (Postgres via Prisma)
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            createdAt: new Date(user.createdAt),
          },
        });

        console.log("User saved from Kafka event:", user.email);
      } catch (err) {
        console.error("Error processing message:", err.message);
      }
    },
  });
}

startConsumer().catch((err) => {
  console.error("Consumer crashed:", err);
});
