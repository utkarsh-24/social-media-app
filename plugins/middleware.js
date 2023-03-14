// 'use strict'

// const fp = require('fastify-plugin')

// /**
//  * This plugins adds some utilities to handle http errors
//  *
//  * @see https://github.com/fastify/fastify-sensible
//  */
// module.exports = fp(async function (fastify, opts) {
//     fastify
//   .register(require('@fastify/middie'),{hook:'preHandler'})
//   .register(subsystem)

// async function subsystem (fastify, opts) {
//   fastify.addHook('onRequest', async (req, reply) => {
//     console.log("#########################################");
//     console.log('first')
//     reply.send("nvfdjksnjknsd");
//     // await asyncMethod()
//   })

//   fastify.use((req, res, next) => {
//     console.log('third')
//     next()
//   })

// //   fastify.addHook('onRequest', async (req, reply) => {
// //     console.log('second')
// //   })

//   fastify.addHook('preValidation', async(request, reply)=> {
//     console.log("#########################################");
//     console.log(request.body);
//   })
// }
// })
