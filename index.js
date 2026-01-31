const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const sendSignupEvent = require("./producer");
const prisma = require("./db");
const UserSignupSchema = require("./schemas/userSignup.schema");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // ✅ validate request body
    const data = UserSignupSchema.parse(req.body);

    // ✅ save user to database
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      },
    });

    // ✅ emit Kafka event (non-blocking)
    await sendSignupEvent(user);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error(err);

    return res.status(400).json({
      error: err.message || "Something went wrong",
    });
  }
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
