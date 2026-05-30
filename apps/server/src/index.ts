import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { version } from '@sroy/shared';
import { authRoutes } from './modules/auth/auth.routes';
import { companyRoutes } from './modules/companies/companies.routes';
import { authenticate } from './middleware/auth';
import * as dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Register plugins
fastify.register(cors, {
  origin: '*',
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key-change-me-in-production',
});

// Decorators
fastify.decorate('authenticate', authenticate);

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', version };
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/v1/auth' });
fastify.register(companyRoutes, { prefix: '/api/v1/admin' });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(`Server listening at http://0.0.0.0:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
