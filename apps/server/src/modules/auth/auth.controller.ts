import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { comparePassword, hashPassword } from '../../lib/auth';
import { LoginInput, RegisterAdminInput } from './auth.schema';

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return reply.status(401).send({ message: 'Invalid email or password' });
  }

  if (user.status !== 'active') {
    return reply.status(403).send({ message: 'User account is inactive' });
  }

  const payload = {
    id: user.id,
    email: user.email,
    companyId: user.companyId,
    isPlatformAdmin: user.isPlatformAdmin,
  };

  const accessToken = request.server.jwt.sign(payload, { expiresIn: '15m' });
  const refreshToken = request.server.jwt.sign(payload, { expiresIn: '7d' });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isPlatformAdmin: user.isPlatformAdmin,
      companyId: user.companyId,
    },
    accessToken,
    refreshToken,
  };
}

export async function registerAdminHandler(
  request: FastifyRequest<{ Body: RegisterAdminInput }>,
  reply: FastifyReply
) {
  const { email, password, fullName } = request.body;

  // Check if any admin exists
  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.isPlatformAdmin, true),
  });

  if (existingAdmin) {
    return reply.status(400).send({ message: 'Platform admin already exists' });
  }

  const passwordHash = await hashPassword(password);

  const [newUser] = await db.insert(users).values({
    email,
    passwordHash,
    fullName,
    isPlatformAdmin: true,
    status: 'active',
  }).returning();

  return {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
  };
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  return request.user;
}

export async function refreshHandler(request: FastifyRequest, reply: FastifyReply) {
  // In a real app, we'd verify the refresh token properly
  // For MVP, we'll just sign a new access token if the user is authenticated
  const user = request.user as any;
  
  const payload = {
    id: user.id,
    email: user.email,
    companyId: user.companyId,
    isPlatformAdmin: user.isPlatformAdmin,
  };

  const accessToken = request.server.jwt.sign(payload, { expiresIn: '15m' });

  return { accessToken };
}
