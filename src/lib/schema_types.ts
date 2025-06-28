
import type { InferSelectModel } from 'drizzle-orm';
import * as schema from '@/lib/server/db/schema';

type Nullable<T> = { [P in keyof T]: T[P] | null };

// Users
export type User = InferSelectModel<typeof schema.userTable>;
export type UserDraft = Omit<User, 'id' | 'created_at' | 'last_updated'>;
export type UserNullable = Nullable<User>;

// Sessions
export type Session = InferSelectModel<typeof schema.sessionTable>;
export type SessionDraft = Session; // No `id`, no timestamps in schema
export type SessionNullable = Nullable<Session>;

// Projects
export type Project = InferSelectModel<typeof schema.projectTable>;
export type ProjectDraft = Omit<Project, 'id' | 'created_at' | 'last_updated'>;
export type ProjectNullable = Nullable<Project>;

// Technologies
export type Technology = InferSelectModel<typeof schema.technologyTable>;
export type TechnologyDraft = Omit<Technology, 'id' | 'created_at' | 'last_updated'>;
export type TechnologyNullable = Nullable<Technology>;

// ProjectTechnology (Join Table)
export type ProjectTechnology = InferSelectModel<typeof schema.projectTechnologyTable>;
export type ProjectTechnologyDraft = Omit<ProjectTechnology, 'id' | 'created_at' | 'last_updated'>;
export type ProjectTechnologyNullable = Nullable<ProjectTechnology>;
