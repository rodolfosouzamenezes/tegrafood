import Fastify from "fastify";

import { productRoutes } from "./routes/product";
import { cartRoutes } from "./routes/cart";

const port = process.env.PORT ? Number(process.env.PORT) : 3333;
const host = '0.0.0.0';

const app = Fastify();

async function bootstrap() {
  // Registrando as rotas
  await app.register(productRoutes);
  await app.register(cartRoutes);

  await app.listen({ port })
    .then(() => {
      console.log(`[SUCCESS] Server is running on port ${port}: http://localhost:${port}/`)
    })
}

bootstrap();