import { eq, asc } from 'drizzle-orm';
import { db } from '../index';
import { projectTable, userTable } from '../schema';
import type { UserDraft, User, Project, ProjectDraft } from '@/lib/schema_types';

export async function getProjectFromId(id: string): Promise<Project | null> {
  const [project] = await db.select().from(projectTable).where(eq(projectTable.id, id));
  return project ?? null;
}

export async function getAllProject(): Promise<Project[] | null> {
  const projects = await db.select().from(projectTable).orderBy(asc(projectTable.priority));
  return projects ?? null;
}

export async function createUser(userData: UserDraft): Promise<User | null> {
  const [user] = await db.insert(userTable).values(userData).returning();
  return user ?? null;
}

export async function createProject(projectData: ProjectDraft): Promise<Project | null> {
  const [project] = await db.insert(projectTable).values(projectData).returning();
  return project ?? null;
}

export async function updateUser(userData: User): Promise<User | null> {
  const [updated_user] = await db
    .update(userTable)
    .set(userData)
    .where(eq(userTable.id, userData.id))
    .returning();

  return updated_user ?? null;
}
