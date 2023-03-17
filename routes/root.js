"use strict";

module.exports = async function (fastify, opts) {
  fastify.addHook("onRequest", async (request, reply) => {
    let headers = request.headers;
    if (headers.bearer == undefined) {
      if (request.url != "/admin/setup") {
        reply.code('401').send({ success: false, message: "Unauthorized access." });
      }
    } else {
      let bearer = headers.bearer;
      let decodedToken = fastify.jwt.decode(bearer);
      let query = {
        KeyConditionExpression: "id = :i and user_role = :r",
        ExpressionAttributeValues: {
          ":i": { S: `${decodedToken.user_id}` },
          ":r": { S: decodedToken.user_role },
        },
        TableName: "user_details",
      };
      let result = await fastify.validateBearer(fastify,query)
      if (!result.success) {
        reply.code('401').send({ success: false, message: "Unauthorized access." });
      }
    }
  });
  fastify.get('/send', (request, reply) => {
    const { mailer } = fastify
  
    mailer.sendMail({
      to: 'brijbahadurpatel@gmail.com',
      subject: 'example',
      text: 'hello world !'
    }, (errors, info) => {
      if (errors) {
        fastify.log.error(errors)
  
        reply.status(500)
        return {
          status: 'error',
          message: 'Something went wrong'
        }
      }
  
      reply.status(200)
      return {
        status: 'ok',
        message: 'Email successfully sent',
        info: {
          from: info.from, // John Doe <john.doe@example.tld>
          to: info.to, // ['someone@example.tld']
        }
      }
    })
  })
  fastify.register(require("./user-route/user"), { prefix: "user" });
  fastify.register(require("./admin-route/admin"), { prefix: "admin" });
};
