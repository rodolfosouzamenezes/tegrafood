import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      isAdmin: boolean;
      avatarUrl: string;
    }
  }
}