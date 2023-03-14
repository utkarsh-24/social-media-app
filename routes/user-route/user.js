"use strict";
const { signupSchema, signInSchema } = require("./userSchema");

module.exports = async function (fastify, opts) {
  fastify.post("/signup", signupSchema, async (request, reply) => {
    let body = request.body;
    let result = await fastify.findUserByEmail(fastify,body.email);
    if (result.success) {
      fastify.response(reply, {
        success: false,
        message: "user with this email already present.",
      });
    } else {
      let password = await fastify.bcrypt.hash(body.password);
      const params = {
        TableName: "user_details",
        Item: {
          user_role: "customer",
          email: body.email,
          password: password,
        },
      };
      await fastify.insert(fastify,params);
      fastify.response(reply, {
        success: true,
        message: "successfully registered.",
      });
    }
  });

  fastify.post("/signin", signInSchema, async (request, reply) => {
    let body = request.body;
    let result = await fastify.findUserByEmail(fastify,body.email);
    if (result.success) {
      let user = result.data[0];
      if (await fastify.bcrypt.compare(body.password, user.password)) {
        let token = await fastify.createToken(user.id, user.user_role);
        fastify.response(reply, {
          success: true,
          message: "user present",
          token: token,
        });
      } else {
        fastify.response(reply, {
          success: false,
          message: "password is wrong",
        });
      }
    } else {
      fastify.response(reply, {
        success: false,
        message: "user not present",
      });
    }
  });
};
