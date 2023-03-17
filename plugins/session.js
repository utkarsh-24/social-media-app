"use strict"
const fp = require('fastify-plugin')


module.exports= fp(async function (fastify,opts){
    fastify.register(require("@fastify/cookie"))
    fastify.register(require('@fastify/session'),{
        secret: 'a secret with minimum length of 32 characters'
    })
})


