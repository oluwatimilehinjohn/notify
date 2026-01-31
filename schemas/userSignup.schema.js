const { z } = require("zod");

const UserSignupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.string().optional(),
});

module.exports = UserSignupSchema;
