import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../db';
import { companies, users, auditLogs } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';
import { CreateCompanyInput, UpdateCompanyInput } from './companies.schema';

async function logAdminAction(
  request: FastifyRequest,
  action: string,
  entityType: string,
  entityId?: string,
  details: any = {}
) {
  const user = request.user as any;
  await db.insert(auditLogs).values({
    userId: user.id,
    action,
    entityType,
    entityId,
    details,
    ipAddress: request.ip,
  });
}

export async function getCompaniesHandler(request: FastifyRequest, reply: FastifyReply) {
  const allCompanies = await db.select().from(companies);
  return allCompanies;
}

export async function createCompanyHandler(
  request: FastifyRequest<{ Body: CreateCompanyInput }>,
  reply: FastifyReply
) {
  const { name, slug, status, settings, enabledModules } = request.body;

  // Check if slug already exists
  const existingCompany = await db.query.companies.findFirst({
    where: eq(companies.slug, slug),
  });

  if (existingCompany) {
    return reply.status(400).send({ message: 'Company with this slug already exists' });
  }

  const [newCompany] = await db
    .insert(companies)
    .values({
      name,
      slug,
      status,
      settings,
      enabledModules,
    })
    .returning();

  await logAdminAction(request, 'CREATE', 'COMPANY', newCompany.id, { name, slug });

  return newCompany;
}

export async function getCompanyByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  const company = await db.query.companies.findFirst({
    where: eq(companies.id, id),
  });

  if (!company) {
    return reply.status(404).send({ message: 'Company not found' });
  }

  return company;
}

export async function updateCompanyHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateCompanyInput }>,
  reply: FastifyReply
) {
  const { id } = request.params;
  const updates = request.body;

  const [updatedCompany] = await db
    .update(companies)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, id))
    .returning();

  if (!updatedCompany) {
    return reply.status(404).send({ message: 'Company not found' });
  }

  await logAdminAction(request, 'UPDATE', 'COMPANY', id, updates);

  return updatedCompany;
}

export async function getAdminStatsHandler(request: FastifyRequest, reply: FastifyReply) {
  const [companiesCount] = await db.select({ count: sql<number>`count(*)` }).from(companies);
  const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);

  return {
    companiesCount: Number(companiesCount.count),
    usersCount: Number(usersCount.count),
  };
}
