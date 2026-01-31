const { Kafka } = require("kafkajs");
const prisma = require("./db"); //  Prisma client
const UserSignupSchema = require("./schemas/userSignup.schema");

const kafka = new Kafka({
  clientId: "notify-app",
  brokers: ["localhost:9092"], // PLAINTEXT local Kafka
});

const consumer = kafka.consumer({ groupId: "notification-group" });

async function startConsumer() {
  await consumer.connect();
  console.log("Kafka Consumer connected");

  await consumer.subscribe({ topic: "user-signup", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const rawValue = message.value.toString();
        // Validate message against schema
        const user = UserSignupSchema.parse(JSON.parse(rawValue));

        // Save to Postgres
        const createdUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            createdAt: new Date(user.createdAt),
          },
        });

        console.log(`User saved to DB: ${createdUser.email}`);
      } catch (err) {
        console.error("Error processing message:", err);
        // Optional: send to dead-letter topic here
      }
    },
  });
}

startConsumer().catch((err) => {
  console.error("Consumer failed to start:", err);
});
