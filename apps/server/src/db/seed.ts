import { db } from './index';
import { users, modules, permissions } from './schema';
import { hashPassword } from '../lib/auth';

async function seed() {
  console.log('Seeding database...');

  // 1. Create Modules
  const [aviationModule] = await db.insert(modules).values({
    name: 'Aviation',
    description: 'Flight booking and management',
  }).returning();

  const [hotelsModule] = await db.insert(modules).values({
    name: 'Hotels',
    description: 'Hotel booking and management',
  }).returning();

  // 2. Create Permissions
  await db.insert(permissions).values([
    { slug: 'aviation.view', moduleId: aviationModule.id, description: 'View flights' },
    { slug: 'aviation.book', moduleId: aviationModule.id, description: 'Book flights' },
    { slug: 'hotels.view', moduleId: hotelsModule.id, description: 'View hotels' },
  ]);

  // 3. Create Super Admin
  const passwordHash = await hashPassword('admin123');
  await db.insert(users).values({
    email: 'admin@sroy.io',
    passwordHash,
    fullName: 'System Admin',
    isPlatformAdmin: true,
    status: 'active',
  });

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
