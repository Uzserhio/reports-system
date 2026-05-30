import { db } from './index';
import { users, companies, modules } from './schema';
import { hashPassword } from '../lib/auth';

async function seedTestData() {
  console.log('Seeding test data...');

  // 1. Get existing modules
  const allModules = await db.select().from(modules);
  const moduleIds = allModules.map(m => m.id);

  // 2. Create Companies
  const [travelCo] = await db.insert(companies).values({
    name: 'Travel Co',
    slug: 'travel-co',
    status: 'active',
    enabledModules: moduleIds,
  }).returning();

  const [flyHigh] = await db.insert(companies).values({
    name: 'Fly High',
    slug: 'fly-high',
    status: 'active',
    enabledModules: [moduleIds[0]], // Only Aviation
  }).returning();

  // 3. Create Users
  const passwordHash = await hashPassword('password123');

  await db.insert(users).values([
    {
      email: 'manager@travelco.com',
      passwordHash,
      fullName: 'TravelCo Manager',
      companyId: travelCo.id,
      status: 'active',
    },
    {
      email: 'agent@flyhigh.com',
      passwordHash,
      fullName: 'FlyHigh Agent',
      companyId: flyHigh.id,
      status: 'active',
    }
  ]);

  console.log('Test data seeding completed!');
  process.exit(0);
}

seedTestData().catch((err) => {
  console.error('Seeding test data failed:', err);
  process.exit(1);
});
