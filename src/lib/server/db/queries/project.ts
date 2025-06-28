import { eq } from 'drizzle-orm';
import { db } from '../index';
import { projectTable, userTable } from '../schema';
import type { UserDraft, User, Project } from '@/lib/schema_types';

export async function getProjectFromId(id: string): Promise<Project | null> {
  const [project] = await db.select().from(projectTable).where(eq(projectTable.id, id));
  return project ?? null;
}

export async function getAllProject(): Promise<Project[] | null> {
  const projects = await db.select().from(projectTable);
  return projects ?? null;
}

export async function createUser(user_data: UserDraft): Promise<User | null> {
  const [user] = await db.insert(userTable).values(user_data).returning();
  return user ?? null;
}

export async function updateUser(user_data: User): Promise<User | null> {
  const [updated_user] = await db
    .update(userTable)
    .set(user_data)
    .where(eq(userTable.id, user_data.id))
    .returning();

  return updated_user ?? null;
}
