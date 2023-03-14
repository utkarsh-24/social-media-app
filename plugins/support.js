'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
const schema = {
  type: 'object',
  required: [  'AWS_ACCESS_KEY', 'AWS_SECRET_ACCESS'],
  properties: {
    AWS_ACCESS_KEY: {
      type: 'string',
      default:"aws_access_key"
    },
    AWS_SECRET_ACCESS: {
      type: 'string',
      default:"aws_secret_access"
    }
  }
}

const options = {
  confKey: 'config', 
  schema: schema,
  dotenv: true,
  data: process.env
}

module.exports = fp(async function (fastify, opts) {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })
  fastify.decorate('createToken',async function(userId,userRole) {
      return await fastify.jwt.sign({
        user_id:userId,
        user_role:userRole
      })
  })
  fastify.register(require('@fastify/env'), options)
})
