import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { loginHandler, meHandler, refreshHandler, registerAdminHandler } from './auth.controller';
import { loginSchema, registerAdminSchema } from './auth.schema';

export async function authRoutes(server: FastifyInstance) {
  const typedServer = server.withTypeProvider<ZodTypeProvider>();

  typedServer.post(
    '/login',
    {
      schema: {
        body: loginSchema,
      },
    },
    loginHandler
  );

  typedServer.post(
    '/register-admin',
    {
      schema: {
        body: registerAdminSchema,
      },
    },
    registerAdminHandler
  );

  typedServer.get(
    '/me',
    {
      preHandler: [server.authenticate],
    },
    meHandler
  );

  typedServer.post(
    '/refresh',
    {
      preHandler: [server.authenticate],
    },
    refreshHandler
  );
}
