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
      },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            title: true,
            description: true,
            imageUrl: true,
            priceInCents: true,
          }
        }
      }
    });

    return {
      cartProducts: products.map((product) => {
        return {
          id: product.id,
          quantity: product.quantity,
          title: product.product.title,
          description: product.product.description,
          imageUrl: product.product.imageUrl,
          priceInCents: product.product.priceInCents,
        }
      })
    };
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

    return reply.status(204).send()
  })

  fastify.patch('/cart/:cartId/quantity', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const cartQuantityParams = z.object({
      cartId: z.string().cuid(),
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
        quantity,
      }
    })

    return reply.status(200).send();
  })

  fastify.delete('/cart/:cartId', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const cartQuantityParams = z.object({
      cartId: z.string().cuid(),
    })

    const { cartId } = cartQuantityParams.parse(request.params);

    await prisma.cart.delete({
      where: {
        id: cartId,
      }
    })

    return reply.status(204).send();
  })
}