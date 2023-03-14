"use strict";
const { adminSetupSchema, adminDetails } = require("./adminSchema");
const kuuid = require("kuuid");
module.exports = async (fastify, opts) => {
  fastify.post("/setup", adminSetupSchema, async (request, reply) => {
    let body = request.body;
    let password = await fastify.bcrypt.hash(adminDetails.password);
    if (
      body.email == adminDetails.email &&
      (await fastify.bcrypt.compare(body.password, password))
    ) { 
      // let result = await fastify.createTable(tableSchema);
      if (true || result.success) {
        let userResult = await fastify.findUserByEmail(fastify,body.email);
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
          let userId = kuuid.id();
          await fastify.insert(fastify,{
            TableName: "user_details",
            Item: {
              id: userId,
              user_role: "admin",
              email: adminDetails.email,
              password: password,
            },
          });
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
