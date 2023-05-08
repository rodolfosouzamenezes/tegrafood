import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get('/products', {
    onRequest: [authenticate]
  }, async () => {
    const products = await prisma.product.findMany();

    return { products }
  })

  fastify.post('/products', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const createProductBody = z.object({
      title: z.string(),
      description: z.string(),
      priceInCents: z.number(),
      imageUrl: z.string().url(),
      categories: z.array(
        z.number().min(0).max(4)
      ),
    })

    const { title, description, categories, imageUrl, priceInCents } = createProductBody.parse(request.body);

    try {
      await prisma.product.create({
        data: {
          title,
          description,
          categories,
          imageUrl,
          priceInCents
        }
      })
    } catch (err) {
      console.log(err);
    }

    return reply.status(201).send()
  })

  fastify.put('/products/:productId', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const productParams = z.object({
      productId: z.string().cuid(),
    })

    const updateProductBody = z.object({
      title: z.string(),
      description: z.string(),
      priceInCents: z.number(),
      imageUrl: z.string().url(),
      categories: z.array(
        z.number().min(0).max(4)
      ),
    })

    const { productId } = productParams.parse(request.params);
    const newProduct = updateProductBody.parse(request.body);

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...newProduct,
      }
    })

    return reply.status(200).send()
  })

  fastify.post('/products/:productId/cart', {
    onRequest: [authenticate]
  }, async (request, reply) => {
    const cartParams = z.object({
      productId: z.string().cuid(),
    })

    const { productId } = cartParams.parse(request.params);

    const cart = await prisma.cart.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: request.user.sub
        }
      }
    })

    if (cart) {
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          quantity: cart.quantity + 1,
        }
      })

      return reply.status(200).send()
    }

    await prisma.cart.create({
      data: {
        productId,
        userId: request.user.sub,
        quantity: 1,
      }
    })

    return reply.status(201).send()
  })
}