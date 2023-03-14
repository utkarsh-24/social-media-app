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
const adminDetails = {
  id: 123,
  user_role: "admin",
  email: "utkarsh24092000@gmail.com",
  password: "utkarsh",
};

module.exports = { adminSetupSchema,adminDetails };
