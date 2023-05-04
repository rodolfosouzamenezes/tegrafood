import { FastifyInstance } from "fastify";
import { z } from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/me', {
    onRequest: [authenticate],
  }, async (request) => {
    return { user: request.user }
  })

  fastify.post('/signup', async (request) => {
    const signupBody = z.object({
      email: z.string().email(),
      password: z.string(),
      name: z.string(),
    })
  
    const { email, password, name } = signupBody.parse(request.body)
  
    let user = await prisma.user.findUnique({
      where: {
        email,
      }
    })
  
    if (user) {
      throw new Error('Usuário já existe')
    }
  
    user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      }
    })
  
    const token = fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl,
    }, {
      sub: user.id,
      expiresIn: '7 days',
    })
  
    return { token }
  })
  
  fastify.post('/login', async (request) => {
    const loginBody = z.object({
      email: z.string().email(),
      password: z.string(),
    })
  
    const { email, password } = loginBody.parse(request.body)
  
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })
  
    if (!user || user.password !== password) {
      throw new Error('Email ou senha inválidos')
    }
  
    const token = fastify.jwt.sign({
      name: user.name,
      avatarUrl: user.avatarUrl,
    }, {
      sub: user.id,
      expiresIn: '7 days',
    })
  
    return { token }
  })
  
}