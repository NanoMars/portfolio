import { eq } from 'drizzle-orm';
import { db } from '../index';
import { userTable } from '../schema';
import type { UserDraft, User } from '@/lib/schema_types';

export async function getUserFromGitHubId(githubId: number): Promise<User | null> {
  const [user] = await db.select().from(userTable).where(eq(userTable.githubId, githubId));
  return user ?? null;
}

export async function getUserFromId(id: string): Promise<User | null> {
  const [user] = await db.select().from(userTable).where(eq(userTable.id, id));
  return user ?? null;
}

export async function createUser(userData: UserDraft): Promise<User | null> {
  const [user] = await db.insert(userTable).values(userData).returning();
  return user ?? null;
}

export async function updateUser(userData: User): Promise<User | null> {
  const [updated_user] = await db
    .update(userTable)
    .set(userData)
    .where(eq(userTable.id, userData.id))
    .returning();

  return updated_user ?? null;
}
