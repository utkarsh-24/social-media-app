"use strict";

const fp = require("fastify-plugin");
module.exports = fp(async function (fastify, opts) {
  fastify.decorate("response", (reply,response)=> {
    if(response.success == true) {
        reply.code('200').send(response);
    } else {
        reply.code('400').send(response)
    }
  });
});
