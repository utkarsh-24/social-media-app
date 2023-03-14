'use strict'

const fp = require('fastify-plugin')

/**
 * This plugins encrypt password
 *
 * 
 */
module.exports = fp(async function (fastify, opts) {
  fastify.register(require('fastify-bcrypt'), {
    saltWorkFactor: 12
  })
})
