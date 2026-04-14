const { isEventProcessed, markEventProcessed } = require("./services/eventLog.service");

async function test() {
  const eventId = "test-123";

  const existsBefore = await isEventProcessed(eventId);
  console.log("Before:", existsBefore);

  await markEventProcessed(eventId, "signup");

  const existsAfter = await isEventProcessed(eventId);
  console.log("After:", existsAfter);
}

test();