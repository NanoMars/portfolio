import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from '@/lib/server/db/schema';

type Nullable<T> = { [P in keyof T]: T[P] | null };

// Users
export type User = InferSelectModel<typeof schema.userTable>;
export type UserDraft = InferInsertModel<typeof schema.userTable>;
export type UserNullable = Nullable<User>;

// Sessions
export type Session = InferSelectModel<typeof schema.sessionTable>;
export type SessionDraft = InferInsertModel<typeof schema.sessionTable>;
export type SessionNullable = Nullable<Session>;

// Projects
export type Project = InferSelectModel<typeof schema.projectTable>;
export type ProjectDraft = InferInsertModel<typeof schema.projectTable>;
export type ProjectNullable = Nullable<Project>;

// Technologies
export type Technology = InferSelectModel<typeof schema.technologyTable>;
export type TechnologyDraft = InferInsertModel<typeof schema.technologyTable>;
export type TechnologyNullable = Nullable<Technology>;

// ProjectTechnology (Join Table)
export type ProjectTechnology = InferSelectModel<typeof schema.projectTechnologyTable>;
export type ProjectTechnologyDraft = InferInsertModel<typeof schema.projectTechnologyTable>;
export type ProjectTechnologyNullable = Nullable<ProjectTechnology>;
