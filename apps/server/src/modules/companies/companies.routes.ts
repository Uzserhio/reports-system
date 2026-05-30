import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  getCompaniesHandler,
  createCompanyHandler,
  getCompanyByIdHandler,
  updateCompanyHandler,
  getAdminStatsHandler,
} from './companies.controller';
import { createCompanySchema, updateCompanySchema } from './companies.schema';

export async function companyRoutes(server: FastifyInstance) {
  const typedServer = server.withTypeProvider<ZodTypeProvider>();

  typedServer.addHook('preHandler', server.authenticate);
  typedServer.addHook('preHandler', async (request, reply) => {
    const user = request.user as any;
    if (!user.isPlatformAdmin) {
      return reply.status(403).send({ message: 'Forbidden: Platform admin access required' });
    }
  });

  typedServer.get('/companies', getCompaniesHandler);

  typedServer.post(
    '/companies',
    {
      schema: {
        body: createCompanySchema,
      },
    },
    createCompanyHandler
  );

  typedServer.get('/companies/:id', getCompanyByIdHandler);

  typedServer.patch(
    '/companies/:id',
    {
      schema: {
        body: updateCompanySchema,
      },
    },
    updateCompanyHandler
  );

  typedServer.get('/stats', getAdminStatsHandler);
}
