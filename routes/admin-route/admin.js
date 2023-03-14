"use strict";
const { adminSetupSchema } = require("./adminSchema");

const kuuid = require("kuuid");
module.exports = async (fastify, opts) => {
  const adminDetails = JSON.parse(fastify.config.ADMIN_CREDENTIALS);
  fastify.post("/setup", adminSetupSchema, async (request, reply) => {
    let body = request.body;
    // reply.send(fastify.config.ADMIN_CREDENTIALS);
    let password = await fastify.bcrypt.hash(adminDetails.password);
    if (
      body.email == adminDetails.email &&
      (await fastify.bcrypt.compare(body.password, password))
    ) {
      // let result = await fastify.createTable(tableSchema);
      if (true || result.success) {
        let userResult = await fastify.findUserByEmail(fastify, body.email);
        if (userResult.success) {
          let token = await fastify.createToken(
            userResult.data[0].id,
            userResult.data[0].user_role
          );
          fastify.response(reply, {
            success: true,
            message: "setup is already done.",
            token: token,
          });
        } else {
          const userId = kuuid.id();
          const params = {
            TableName: "user_details",
            Item: {
              id: userId,
              user_role: adminDetails.user_role,
              email: adminDetails.email,
              password: password,
            }
          };
          await fastify.insert(fastify, params);
          let token = await fastify.createToken(userId, adminDetails.user_role);
          fastify.response(reply, {
            success: true,
            message: "setup created successfully",
            token: token,
          });
        }
      } else {
        fastify.response(reply, result);
      }
    } else {
      reply
        .code("401")
        .send({ success: false, message: "Unauthorized access." });
    }
  });
};
