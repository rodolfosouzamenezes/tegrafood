import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function cartRoutes(fastify: FastifyInstance) {
  fastify.get('/cart', {
    onRequest: [authenticate],
  }, async (request) => {
    const products = await prisma.cart.findMany({
      where: {
        userId: request.user.sub,
      }
    });

    return { products }
  })

  fastify.delete('/cart', {
    onRequest: [authenticate],
  }, async (request, reply) => {
    try {
      await prisma.cart.deleteMany({
        where: {
          userId: request.user.sub
        }
      })
    } catch (err) {
      console.log(err);
    }

    return reply.status(204)
  })

  fastify.patch('card/:cartId/quantity', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const cartQuantityParams = z.object({
      cartId: z.string().uuid(),
    })

    const cartQuantityBody = z.object({
      quantity: z.number(),
    })

    const { cartId } = cartQuantityParams.parse(request.params);
    const { quantity } = cartQuantityBody.parse(request.body);

    await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        quantity
      }
    })

    return reply.status(200);
  })

  fastify.delete('card/:cartId', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const cartQuantityParams = z.object({
      cartId: z.string().uuid(),
    })

    const { cartId } = cartQuantityParams.parse(request.params);

    await prisma.cart.delete({
      where: {
        id: cartId,
      }
    })

    return reply.status(204);
  })
}