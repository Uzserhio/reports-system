import { FastifyReply, FastifyRequest } from 'fastify';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
}

export async function tenantContext(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as any;
  if (user && user.companyId) {
    request.companyId = user.companyId;
  }
}

export async function checkPlatformAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user as any;
  if (!user || !user.isPlatformAdmin) {
    return reply.status(403).send({ message: 'Forbidden: Platform admin access required' });
  }
}

export function checkPermission(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any;
    if (user.isPlatformAdmin) return;

    // In a real app, we'd fetch permissions from DB or cache
    // For MVP, we'll assume platform admins have all permissions
    // and companies have restricted access based on their roles
    
    // Logic to check if user.permissions includes 'permission'
    // request.user.permissions should be populated by authenticate or a separate decorator
  };
}
