const prisma = require("../db");

async function isEventProcessed(eventId) {
  const existing = await prisma.eventLog.findUnique({
    where: { eventId },
  });

  return !!existing;
}

async function markEventProcessed(eventId, type) {
  return prisma.eventLog.create({
    data: { eventId, type },
  });
}

module.exports = {
  isEventProcessed,
  markEventProcessed,
};