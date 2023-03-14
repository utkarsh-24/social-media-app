const signupSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        username: { type: "string" },
        email: { type: "string", pattern: "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$" },
        password: { type: "string" },
      },
      required: ["name", "username", "email", "password"],
      additionalProperties: false,
    },
  },
};

const signInSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        email: { type: "string" },
        password: { type: "string" },
      },
      required: ["email", "password"],
      additionalProperties: false,
    },
  },
};

module.exports = { signupSchema, signInSchema };
