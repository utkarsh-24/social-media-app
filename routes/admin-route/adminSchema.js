const adminSetupSchema = {
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

module.exports = { adminSetupSchema };
