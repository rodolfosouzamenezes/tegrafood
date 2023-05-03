import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";

export async function productRoutes(fastify: FastifyInstance) {
  fastify.get('/products', async () => {
    const products = await prisma.product.findMany();

    return { products }
  })

  fastify.post('/products', async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
      description: z.string(),
      priceInCents: z.number(),
      imageUrl: z.string().url(),
      categories: z.array(
        z.number().min(0).max(4)
      ),
    })

    const { title, description, categories, imageUrl, priceInCents } = createPoolBody.parse(request.body);

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

    return reply.status(201)
  })
}