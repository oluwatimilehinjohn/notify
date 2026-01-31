const express = require("express");
const sendSignupEvent = require("./producer");
const prisma = require("./db");
const UserSignupSchema = require("./schemas/userSignup.schema");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // ✅ validate request
    const data = UserSignupSchema.parse(req.body);

    // ✅ save to DB
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });

    // ✅ emit event
    await sendSignupEvent(user);

    res.json({ message: "User created", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
