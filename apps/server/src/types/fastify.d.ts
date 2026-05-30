import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      companyId: string | null;
      isPlatformAdmin: boolean;
    };
    user: {
      id: string;
      email: string;
      companyId: string | null;
      isPlatformAdmin: boolean;
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
  interface FastifyRequest {
    companyId?: string | null;
  }
}
