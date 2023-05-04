import Fastify from "fastify";
import jwt from "@fastify/jwt";

import { authRoutes } from "./routes/auth";
import { cartRoutes } from "./routes/cart";
import { productRoutes } from "./routes/product";

const port = process.env.PORT ? Number(process.env.PORT) : 3333;
const host = '0.0.0.0';

const app = Fastify();

async function bootstrap() {
  await app.register(jwt, {
    secret: String(process.env.JWT_SECRET),
  })

  // Registrando as rotas
  await app.register(authRoutes);
  await app.register(productRoutes);

  await app.listen({ port })
    .then(() => {
      console.log(`[SUCCESS] Server is running on port ${port}: http://localhost:${port}/`)
    })
}

bootstrap();