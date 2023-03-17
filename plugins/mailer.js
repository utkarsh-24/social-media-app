'use strict'

const fp = require('fastify-plugin')

/**
 * This plugins send mails
 *
 * 
 */
module.exports = fp(async function (fastify, opts) {
  fastify.register(require('fastify-mailer'), {
    defaults: { from: 'Utkarsh Patel <utkarshpatel24092000@gmail.com>' },
    transport: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use TLS
      auth: {
        user: 'utkarshpatel24092000@gmail.com',
        pass: 'Bahadur@24Utkarsh'
      }
    }
  })
})
